ALTER PROCEDURE [rule].[rule.lock] -- the SP locks/unlocks(after approval) selected rules
    @conditionId BIGINT, -- a condition id
    @isEnabled BIT, -- the condition status to set
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS
BEGIN TRY
    DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)

    -- checks if the user has a right to make the operation
    DECLARE @actionID VARCHAR(100) = OBJECT_SCHEMA_NAME(@@PROCID) + '.' + OBJECT_NAME(@@PROCID), @return INT = 0
    EXEC @return = [user].[permission.check] @actionId = @actionID, @objectId = NULL, @meta = @meta
    IF @return != 0
    BEGIN
        RETURN 55555
    END

    IF EXISTS(
    SELECT ru.status
    FROM [rule].conditionUnapproved ru
    WHERE ru.status IN ('new', 'pending') AND @conditionId = ru.conditionId
    )
    BEGIN
        RAISERROR('user.cannotLockRule', 16, 1);
        -- RETURN 5555
    END


    IF @isEnabled = 1
    BEGIN
        SET IDENTITY_INSERT [rule].[conditionUnapproved] ON
        INSERT INTO [rule].[conditionUnapproved] (conditionId, priority, status, operationStartDate, operationEndDate, sourceAccountId, [name], [description], notes, isDeleted, createdBy, updatedBy, isEnabled)
        SELECT cu.conditionId, cu.priority, 'pending', cu.operationStartDate, cu.operationEndDate, cu.sourceAccountId, [name], [description], notes, 0, @userId, @userId, @isEnabled
        FROM [rule].[condition] cu
        WHERE cu.conditionId = @conditionId
        SET IDENTITY_INSERT [rule].[conditionUnapproved] OFF
    END
    ELSE
    BEGIN
        SET IDENTITY_INSERT [rule].[conditionUnapproved] ON
        INSERT INTO [rule].[conditionUnapproved] (conditionId, priority, status, operationStartDate, operationEndDate, sourceAccountId, [name], [description], notes, isDeleted, createdBy, updatedBy, isEnabled)
        SELECT cu.conditionId, cu.priority, 'pending', cu.operationStartDate, cu.operationEndDate, cu.sourceAccountId, [name], [description], notes, 0, @userId, @userId, @isEnabled
        FROM [rule].[condition] cu
        WHERE cu.conditionId = @conditionId
        SET IDENTITY_INSERT [rule].[conditionUnapproved] OFF
    END

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION
    EXEC core.error
    RETURN 55555
END CATCH
