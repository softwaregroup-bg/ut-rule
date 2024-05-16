ALTER PROCEDURE [rule].[rule.discard]
    @conditionId INT,
    @meta core.metaDataTT READONLY -- information for the logged user
AS

BEGIN TRY

    DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
    -- checks if the user has a right to get user
    DECLARE @actionID VARCHAR(100) = OBJECT_SCHEMA_NAME(@@PROCID) + '.' + OBJECT_NAME(@@PROCID), @return INT = 0
    EXEC @return = [user].[permission.check] @actionId = @actionID, @objectId = NULL, @meta = @meta
    IF @return != 0
    BEGIN
        RETURN 55555
    END

    IF NOT EXISTS(
        SELECT 1
        FROM [rule].[condition] c
        WHERE c.conditionId = @conditionId)
        AND
        NOT EXISTS(
        SELECT 1
        FROM [rule].[conditionUnapproved] c
        WHERE c.conditionId = @conditionId)
        BEGIN
            RAISERROR ('rule.ruleNotExists', 16, 1)
        END



    -- check if the maker and the checker are different users
    IF EXISTS (
        SELECT u.updatedBy
        FROM [user].[userUnapproved] u
        LEFT JOIN [user].[vSystemUser] su ON su.actorId = u.updatedBy
        WHERE u.actorId = @userId
            AND u.updatedBy = @userId
            AND su.actorId IS NULL)
        RAISERROR('user.cannotPerformThisOperation', 16, 1)

    BEGIN TRANSACTION


        DECLARE @splitNames TABLE (splitNameId BIGINT);
        INSERT INTO @splitNames SELECT splitNameId FROM [rule].[splitNameUnapproved] WHERE conditionId = @conditionId


    -- handle condition actor
    DELETE FROM [rule].[conditionActorUnapproved]
    WHERE conditionId = @conditionId


    -- handle condition item
    DELETE FROM [rule].[conditionItemUnapproved]
    WHERE conditionId = @conditionId



    -- handle condition property
    DELETE FROM [rule].[conditionPropertyUnapproved]
    WHERE conditionId = @conditionId


    -- handle limit
    DELETE FROM [rule].limitUnapproved
    WHERE conditionId = @conditionId


    IF EXISTS (SELECT 1 FROM @splitNames)
        BEGIN
            -- handle split analytic
            DELETE spa
            FROM [rule].[splitAnalyticUnapproved] spa
            INNER JOIN [rule].[splitAssignmentUnapproved] sp ON sp.splitAssignmentId = spa.splitAssignmentId
            INNER JOIN [rule].[splitNameUnapproved] sn ON sp.splitNameId = sp.splitNameId
            JOIN @splitNames s ON sn.splitNameId = s.splitNameId


            -- handle split assignment
            DELETE sau
            FROM [rule].[splitAssignmentUnapproved] sau
            INNER JOIN [rule].[splitNameUnapproved] sn ON sn.splitNameId = sau.splitNameId
            WHERE sn.conditionId = @conditionId

            -- handle split range
            DELETE sau
            FROM [rule].[splitRangeUnapproved] sau
            INNER JOIN [rule].[splitNameUnapproved] sn ON sn.splitNameId = sau.splitNameId
            WHERE sn.conditionId = @conditionId

            -- handle split name
            DELETE FROM [rule].[splitNameUnapproved]
            WHERE conditionid = @conditionId
        END

    -- handle condition
    DELETE FROM [rule].[conditionUnapproved]
    WHERE conditionId = @conditionId


    COMMIT TRANSACTION

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION
    EXEC core.error
    RETURN 55555
END CATCH
