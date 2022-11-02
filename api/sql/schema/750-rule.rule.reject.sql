ALTER PROCEDURE [rule].[rule.reject]
    @conditionId INT,
    @rejectReason NVARCHAR(MAX), -- the reason the user was rejected by the checker
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

    -- handle condition
        UPDATE c
    SET
        c.status = 'rejected',
        c.rejectReason = @rejectReason
    FROM [rule].[conditionUnapproved] c
    WHERE c.conditionId = @conditionId




    -- handle condition actor
    UPDATE ca
    SET
        ca.status = 'rejected'
    FROM [rule].[conditionActorUnapproved] ca
    WHERE ca.conditionId = @conditionId



    -- handle condition item
    UPDATE ca
    SET
        ca.status = 'rejected'
    FROM [rule].[conditionItemUnapproved] ca
    WHERE ca.conditionId = @conditionId



    -- handle condition property
    UPDATE ca
    SET
        ca.status = 'rejected'
    FROM [rule].[conditionPropertyUnapproved] ca
    WHERE ca.conditionId = @conditionId



    -- handle limit
    UPDATE ca
    SET
        ca.status = 'rejected'
    FROM [rule].limit ca
    WHERE ca.conditionId = @conditionId



    -- handle split analytic
    UPDATE spa
    SET
        spa.status = 'rejected'
    FROM [rule].[splitAnalyticUnapproved] spa
    INNER JOIN [rule].[splitAssignmentUnapproved] sp ON sp.splitAssignmentId = spa.splitAssignmentId
    INNER JOIN [rule].[splitNameUnapproved] sn ON sp.splitNameId = sp.splitNameId
    WHERE sn.conditionId = @conditionId



    -- handle split name
    UPDATE sn
    SET
        sn.status = 'rejected'
    FROM [rule].[splitNameUnapproved] sn
    WHERE sn.conditionid = @conditionId



    -- handle split range
    UPDATE sa
    SET
        sa.status = 'rejected'
    FROM [rule].[splitRangeUnapproved] sa
    JOIN [rule].[splitNameUnapproved] sna ON sa.splitNameId = sna.splitNameId
    WHERE sna.conditionId = @conditionId


    -- handle split assignment
    UPDATE sa
    SET
        sa.status = 'rejected'
    FROM [rule].[splitAssignmentUnapproved] sa
    JOIN [rule].[splitNameUnapproved] sna ON sa.splitNameId = sna.splitNameId
    WHERE sna.conditionId = @conditionId



    -- handle split range
    UPDATE sr
    SET
        sa.status = 'rejected'
    FROM [rule].[splitRangeUnapproved] sr
    JOIN [rule].[splitNameUnapproved] sna ON sr.splitNameId = sna.splitNameId
    WHERE sna.conditionId = @conditionId


    COMMIT TRANSACTION

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION
    EXEC core.error
    RETURN 55555
END CATCH
