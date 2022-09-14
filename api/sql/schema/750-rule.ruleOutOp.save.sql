ALTER PROCEDURE [rule].[ruleOutOp.save] -- SP to save limits for outlet and operators
    @storeData [rule].LimitOutOpData READONLY,
    @operatorsData [rule].LimitOutOpData READONLY,
    @storeId BIGINT,
    @currency VARCHAR(3) = 'USD',
    @meta core.metaDataTT READONLY -- information for the logged user
AS
SET NOCOUNT ON
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)

BEGIN TRY
    DECLARE @TranCounter INT = @@TRANCOUNT
    DECLARE @storesNewData [rule].conditionOutOpTT
    DECLARE @storeData2 [rule].LimitOutOpData
    DECLARE @operatorsData2 [rule].LimitOutOpData

    DECLARE @operatorsNewData AS TABLE (
        conditionId BIGINT,
        [action] nVARCHAR(10)
    );
    IF @TranCounter = 0
        BEGIN TRANSACTION

            INSERT INTO @storeData2
            SELECT * FROM @storeData

            INSERT INTO @operatorsData2
            SELECT * FROM @operatorsData
            ----------------------------------------------------
            -- OUTLETS
            ----------------------------------------------------
            -- Add, edit from condition - outlet
            MERGE INTO [rule].conditionOutOp ca
            USING (SELECT DISTINCT [ConditionId] FROM @storeData2) ca1
                ON ca.conditionId = ca1.conditionId
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (createdBy, createdOn)
                VALUES (@userId, GETUTCDATE())
            WHEN MATCHED THEN
                UPDATE SET updatedBy = @userId,
                    updatedOn = GETUTCDATE()
            OUTPUT INSERTED.* INTO @storesNewData;

            --Update conditionId on new records - outlet
            UPDATE @storeData2
                SET conditionId = (SELECT TOP 1 conditionId FROM @storesNewData)
            WHERE conditionId = 0

            -- Add on conditionActor - outlet
            MERGE INTO [rule].conditionActorOutOp AS ca
            USING (SELECT DISTINCT ConditionId, actorId, factorLevel FROM @storeData2) AS ca1
                ON (ca.conditionId = ca1.conditionId AND ca.actorId = ca1.actorId)
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, actorId, factorLevel)
                VALUES (ca1.conditionId, ca1.actorId, ca1.factorLevel);

            -- Logic to delete the outlet conditions
            UPDATE [rule].conditionOutOp
            SET updatedBy = @userId,
                updatedOn = GETUTCDATE(),
                isDeleted = 1
            WHERE conditionId IN(
                SELECT DISTINCT da.conditionId
                FROM [rule].conditionActorOutOp da
                LEFT JOIN @storeData2 da1 ON da1.actorId = da.actorId
                WHERE da.actorId = @storeId AND da1.actorId IS NULL
            )

            -- Add, edit from conditionLimit - outlet
            MERGE INTO [rule].LimitOutOp ca
            USING @storeData2 ca1
                ON ca.conditionId = ca1.conditionId AND ca.transferTypeId = ca1.transferTypeId
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, currency, minAmountDaily, maxAmountDaily, minAmountWeekly, maxAmountWeekly, minAmountMonthly, maxAmountMonthly, transferTypeId)
                VALUES (ca1.conditionId, @currency, ca1.minAmountDaily, ca1.maxAmountDaily, ca1.minAmountWeekly, ca1.maxAmountWeekly, ca1.minAmountMonthly, ca1.maxAmountMonthly,
                    ca1.transferTypeId)
            WHEN MATCHED THEN
                UPDATE SET currency = @currency,
                minAmountDaily = ca1.minAmountDaily,
                maxAmountDaily = ca1.maxAmountDaily,
                minAmountWeekly = ca1.minAmountWeekly,
                maxAmountWeekly = ca1.maxAmountWeekly,
                minAmountMonthly = ca1.minAmountMonthly,
                maxAmountMonthly = ca1.maxAmountMonthly;

            DELETE q1
            FROM [rule].LimitOutOp q1
            JOIN [rule].conditionActorOutOp coo ON coo.conditionId = q1.conditionId
            LEFT JOIN @storeData2 q2 ON q1.conditionId = q2.conditionId
            AND q1.transferTypeId = q2.transferTypeId
            WHERE q2.transferTypeId IS NULL AND coo.actorId = @storeId

            ----------------------------------------------------
            -- OPERATORS
            ----------------------------------------------------
            -- Add, edit from condition - operator
            MERGE INTO [rule].conditionOutOp ca
            USING (SELECT DISTINCT [ConditionId], actorId FROM @operatorsData2) ca1
                ON ca.conditionId = ca1.conditionId
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (createdBy, createdOn)
                VALUES (@userId, GETUTCDATE())
            WHEN MATCHED THEN
                UPDATE SET updatedBy = @userId,
                    updatedOn = GETUTCDATE()
            OUTPUT INSERTED.conditionId, $action INTO @operatorsNewData;

            --Update conditionId on new records - operator
            UPDATE a
            SET a.conditionId = b.conditionId
            FROM @operatorsData2 a
            INNER JOIN (
                SELECT conditionId, actorId
                FROM (
                    SELECT conditionId, ROW_NUMBER() OVER(ORDER BY conditionId ASC) AS [Row] FROM @operatorsNewData WHERE [action] = 'INSERT'
                ) a
                INNER JOIN (
                    SELECT DISTINCT actorId, ROW_NUMBER() OVER(ORDER BY actorId ASC) AS [Row] FROM @operatorsData2 WHERE conditionId = 0
                ) b ON a.[row] = b.[row]
            ) b ON A.actorId = b.actorId AND a.conditionId = 0

            -- Add on conditionActor - operator
                MERGE INTO [rule].conditionActorOutOp AS ca
                USING (SELECT DISTINCT ConditionId, actorId, factorLevel FROM @operatorsData2) AS ca1
                    ON (ca.conditionId = ca1.conditionId AND ca.actorId = ca1.actorId)
                WHEN NOT MATCHED BY TARGET THEN
                    INSERT (conditionId, actorId, factorLevel)
                    VALUES (ca1.conditionId, ca1.actorId, ca1.factorLevel);

            -- logic delete to the operator conditions
            UPDATE [rule].conditionOutOp
            SET updatedBy = @userId,
                updatedOn = GETUTCDATE(),
                isDeleted = 1
            WHERE conditionId IN (
                SELECT DISTINCT da.conditionId
                FROM [rule].conditionActorOutOp da
                INNER JOIN [agent].operator op ON op.actorId = da.actorId AND op.storeId = @storeId
                LEFT JOIN @operatorsData2 da1 ON da1.actorId = da.actorId
                WHERE da1.actorId IS NULL
            )

            -- Add, edit from conditionLimit - operator
            MERGE INTO [rule].LimitOutOp ca
            USING @operatorsData2 ca1
                ON ca.conditionId = ca1.conditionId AND ca.transferTypeId = ca1.transferTypeId
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, currency, minAmountDaily, maxAmountDaily, minAmountWeekly, maxAmountWeekly, minAmountMonthly, maxAmountMonthly, transferTypeId)
                VALUES (ca1.conditionId, @currency, ca1.minAmountDaily, ca1.maxAmountDaily, ca1.minAmountWeekly, ca1.maxAmountWeekly, ca1.minAmountMonthly, ca1.maxAmountMonthly,
                ca1.transferTypeId)
            WHEN MATCHED THEN
                UPDATE SET currency = @currency,
                    minAmountDaily = ca1.minAmountDaily,
                    maxAmountDaily = ca1.maxAmountDaily,
                    minAmountWeekly = ca1.minAmountWeekly,
                    maxAmountWeekly = ca1.maxAmountWeekly,
                    minAmountMonthly = ca1.minAmountMonthly,
                    maxAmountMonthly = ca1.maxAmountMonthly;

            DELETE q1
            FROM [rule].LimitOutOp q1
            JOIN [rule].conditionActorOutOp coo ON coo.conditionId = q1.conditionId
            JOIN agent.operator op ON op.actorId = coo.actorId
            LEFT JOIN @operatorsData2 q2 ON q1.conditionId = q2.conditionId
            AND q1.transferTypeId = q2.transferTypeId
            WHERE q2.transferTypeId IS NULL AND op.storeId = @storeId

    IF @TranCounter = 0
        COMMIT TRANSACTION;

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH
