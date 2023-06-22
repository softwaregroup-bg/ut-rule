ALTER PROCEDURE [rule].[rule.deleteUnapproved]
    @conditionId core.arrayList READONLY,
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS
BEGIN TRY
    BEGIN TRANSACTION
        DELETE x
        FROM [rule].[conditionActorUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[conditionItemUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[conditionPropertyUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[limitUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[splitAnalyticUnapproved] x
        JOIN [rule].[splitAssignmentUnapproved] sp ON sp.splitAssignmentId = x.splitAssignmentId
        JOIN [rule].[splitNameUnapproved] sn ON sp.splitNameId = sn.splitNameId
        JOIN @conditionId c ON c.value = sn.conditionId

        DELETE x
        FROM [rule].[splitAssignmentUnapproved] x
        JOIN [rule].[splitNameUnapproved] sn ON sn.splitNameId = x.splitNameId
        JOIN @conditionId c ON c.value = sn.conditionId

        DELETE x
        FROM [rule].[splitRangeUnapproved] x
        JOIN [rule].[splitNameUnapproved] sn ON sn.splitNameId = x.splitNameId
        JOIN @conditionId c ON c.value = sn.conditionId

        DELETE x
        FROM [rule].[splitNameUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

        DELETE x
        FROM [rule].[conditionUnapproved] x
        JOIN @conditionId c ON c.value = x.conditionId

    COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION
    EXEC core.error
    RETURN 55555
END CATCH
