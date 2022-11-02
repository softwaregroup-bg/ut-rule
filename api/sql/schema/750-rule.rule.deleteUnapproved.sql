ALTER PROCEDURE [rule].[rule.deleteUnapproved]
    @conditionId core.arrayList READONLY,
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
BEGIN TRY

    BEGIN TRANSACTION
        DELETE x
        FROM
            [rule].limitUnapproved x
        JOIN
            @conditionId item ON x.conditionId = item.value

        DELETE x
        FROM
            [rule].conditionActorUnapproved x
        JOIN
            @conditionId item ON x.conditionId = item.value

        DELETE x
        FROM
            [rule].conditionItemUnapproved x
        JOIN
            @conditionId item ON x.conditionId = item.value

        DELETE x
        FROM
            [rule].conditionPropertyUnapproved x
        JOIN
            @conditionId item ON x.conditionId = item.value

        DELETE
            x
        FROM
            [rule].splitRangeUnapproved x
        JOIN
            [rule].splitNameUnapproved s ON s.splitNameId = x.splitNameId
        JOIN
            @conditionId item ON s.conditionId = item.value

        DELETE
            x
        FROM
            [rule].splitAnalyticUnapproved x
        JOIN
            [rule].splitAssignmentUnapproved y ON y.splitAssignmentId = x.splitAssignmentId
        JOIN
            [rule].splitNameUnapproved s ON s.splitNameId = y.splitNameId
        JOIN
            @conditionId item ON s.conditionId = item.value

        DELETE
            x
        FROM
            [rule].splitAssignmentUnapproved x
        JOIN
            [rule].splitNameUnapproved s ON s.splitNameId = x.splitNameId
        JOIN
            @conditionId item ON s.conditionId = item.value

        DELETE
            x
        FROM
            [rule].splitRangeUnapproved x
        JOIN
            [rule].splitNameUnapproved s ON s.splitNameId = x.splitNameId
        JOIN
            @conditionId item ON s.conditionId = item.value

        DELETE
            x
        FROM
            [rule].splitNameUnapproved x
        JOIN
            @conditionId item ON x.conditionId = item.value

        DELETE
            x
        FROM
            [rule].conditionUnapproved x
        JOIN
            @conditionId item ON x.conditionId = item.value


    COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION
    EXEC core.error
    RETURN 55555
END CATCH
