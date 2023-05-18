ALTER PROCEDURE [rule].[rule.remove]
    @conditionId core.arrayList READONLY,
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
BEGIN TRY

    BEGIN TRANSACTION
        UPDATE x
        SET isDeleted = 1,
        updatedOn = GETUTCDATE(),
        updatedBy = @userId
        FROM
            [rule].condition x
        JOIN
            @conditionId item ON x.conditionId = item.value

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
