ALTER PROCEDURE [rule].[rule.remove]
    @conditionId core.arrayList READONLY,
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS
SET NOCOUNT ON
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
DECLARE @condition BIGINT = (SELECT [value] FROM @conditionId)
BEGIN TRY

    BEGIN TRANSACTION
        BEGIN

            SET IDENTITY_INSERT [rule].[conditionUnapproved] ON -- allow conditionId to be inserted in the conditionunapproved table

            INSERT INTO [rule].conditionUnapproved (conditionId, [priority], operationStartDate, operationEndDate, sourceAccountId,
            destinationAccountId, createdOn, createdBy, [status], isEnabled, isDeleted
            )
            SELECT conditionId, c.[priority], c.operationStartDate, c.operationEndDate, c.sourceAccountId,
            c.destinationAccountId, c.createdOn, c.createdBy, 'pending', isEnabled, 1
            FROM [rule].condition c
            WHERE c.conditionId = @condition;
            SET IDENTITY_INSERT [rule].[conditionUnapproved] OFF


            INSERT INTO [rule].conditionActorUnapproved (conditionId, factor, actorId)
            SELECT conditionId, ca1.factor, ca1.actorId
            FROM [rule].conditionActor ca1
            WHERE ca1.conditionId = @condition;


            INSERT INTO [rule].conditionItemUnapproved (conditionId, factor, itemNameId)
            SELECT conditionId, ci1.factor, ci1.itemNameId
            FROM [rule].conditionItem ci1
            WHERE ci1.conditionId = @condition;


            INSERT INTO [rule].conditionPropertyUnapproved(conditionId, factor, name, value, status)
            SELECT conditionId, cp1.factor, cp1.name, cp1.value, 'pending'
            FROM [rule].conditionProperty cp1
            WHERE cp1.conditionId = @condition;



            INSERT INTO [rule].limitUnapproved(conditionId, currency, minAmount, maxAmount, maxAmountDaily, maxCountDaily, maxAmountWeekly, maxCountWeekly, maxAmountMonthly, maxCountMonthly, [credentials], [priority])
            SELECT conditionId, ll.currency, ll.minAmount, ll.maxAmount, ll.maxAmountDaily, ll.maxCountDaily, ll.maxAmountWeekly, ll.maxCountWeekly, ll.maxAmountMonthly, ll.maxCountMonthly, ll.[credentials], ll.[priority]
            FROM [rule].limit ll
            WHERE conditionId = @condition;


            SET IDENTITY_INSERT [rule].splitNameUnapproved ON

            INSERT INTO [rule].splitNameUnapproved (splitNameId, conditionId, [name], tag)
            SELECT splitNameId, conditionId, [name], tag
            FROM [rule].splitName
            WHERE conditionId = @condition

            SET IDENTITY_INSERT [rule].splitNameUnapproved OFF

            INSERT INTO [rule].splitRangeUnapproved(
                splitNameId,
                startAmount,
                startAmountCurrency,
                startAmountDaily,
                startCountDaily,
                startAmountWeekly,
                startCountWeekly,
                startAmountMonthly,
                startCountMonthly,
                isSourceAmount,
                minValue,
                maxValue,
                [percent],
                percentBase)
            SELECT
                r.splitNameId,
                r.startAmount,
                r.startAmountCurrency,
                r.startAmountDaily,
                r.startCountDaily,
                r.startAmountWeekly,
                r.startCountWeekly,
                r.startAmountMonthly,
                r.startCountMonthly,
                r.isSourceAmount,
                r.minValue,
                r.maxValue,
                r.[percent],
                r.percentBase
				FROM [rule].splitRange r
				JOIN [rule].splitName sn ON sn.splitNameId = r.splitNameId
				WHERE sn.conditionId = @condition;


        INSERT INTO [rule].splitAssignmentUnapproved (splitNameId, debit, credit, minValue, maxValue, [percent], description)
        SELECT r.splitNameId, r.debit, r.credit, r.minValue, r.maxValue, r.[percent], r.description
        FROM [rule].splitAssignment r
        JOIN [rule].splitName sn ON sn.splitNameId = r.splitNameId
        WHERE sn.conditionId = @condition;

        INSERT INTO [rule].splitAnalyticUnapproved(splitAssignmentId, [name], [value])
        SELECT r.splitAssignmentId, r.[name], r.[value]
        FROM [rule].splitAnalytic r
        JOIN [rule].splitAssignment sa ON sa.splitAssignmentId = r.splitAssignmentId
        JOIN [rule].splitName sn ON sn.splitNameId = sa.splitNameId
        WHERE sn.conditionId = @condition
            ;
        END

    COMMIT TRANSACTION

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH
