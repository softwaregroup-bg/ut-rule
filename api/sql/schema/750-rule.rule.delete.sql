ALTER PROCEDURE [rule].[rule.delete]
    @conditionId core.arrayList READONLY,
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS
BEGIN TRY
    DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
    BEGIN TRANSACTION
        DELETE x
        FROM [rule].[conditionActorUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[conditionActor] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[conditionItemUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[conditionItem] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[conditionPropertyUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[conditionProperty] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[limitUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[limit] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[splitAnalyticUnapproved] x
        JOIN [rule].[splitAssignmentUnapproved] sp ON sp.splitAssignmentId = x.splitAssignmentId
        JOIN [rule].[splitNameUnapproved] sn ON sp.splitNameId = sn.splitNameId
        JOIN @conditionId c ON c.value = sn.conditionId

        DELETE x
        FROM [rule].[splitAnalytic] x
        JOIN [rule].[splitAssignment] sp ON sp.splitAssignmentId = x.splitAssignmentId
        JOIN [rule].[splitName] sn ON sp.splitNameId = sn.splitNameId
        JOIN @conditionId c ON c.value = sn.conditionId

        DELETE x
        FROM [rule].[splitAssignmentUnapproved] x
        JOIN [rule].[splitNameUnapproved] sn ON sn.splitNameId = x.splitNameId
        JOIN @conditionId c ON c.value = sn.conditionId

        DELETE x
        FROM [rule].[splitAssignment] x
        JOIN [rule].[splitName] sn ON sn.splitNameId = x.splitNameId
        JOIN @conditionId c ON c.value = sn.conditionId

        DELETE x
        FROM [rule].[splitRangeUnapproved] x
        JOIN [rule].[splitNameUnapproved] sn ON sn.splitNameId = x.splitNameId
        JOIN @conditionId c ON c.value = sn.conditionId

        DELETE x
        FROM [rule].[splitRange] x
        JOIN [rule].[splitName] sn ON sn.splitNameId = x.splitNameId
        JOIN @conditionId c ON c.value = sn.conditionId

        DELETE x
        FROM [rule].[splitNameUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[splitName] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[conditionUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

        -- UPDATE x
        -- SET isDeleted = 1,
        -- isEnabled = 0,
        -- updatedOn = GETUTCDATE(),
        -- updatedBy = @userId,
        -- [status] = 'Deleted'
        -- FROM
        --     [rule].condition x
        -- JOIN
        --     @conditionId item ON x.conditionId = item.value

        DECLARE @outcome XML = (
        SELECT
            x.conditionId [key],
            x.priority rulePriority,
            GETUTCDATE() deletionDateTime
        FROM
            [rule].condition x
        JOIN
            @conditionId item ON x.conditionId = item.value
        FOR XML RAW
    )

    EXEC core.outcome @proc = @@PROCID, @outcome = @outcome, @meta = @meta
    COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION
    EXEC core.error
    RETURN 55555
END CATCH
