ALTER PROCEDURE [rule].[rule.remove]
    @conditionId core.arrayList READONLY
AS
BEGIN TRY
    BEGIN TRANSACTION
        SELECT 'fee' AS resultSetName
        DELETE
            f
        OUTPUT
            deleted.*
        FROM
            [rule].fee f
        JOIN
            @conditionId item ON f.conditionId = item.value

        SELECT 'limit' AS resultSetName
        DELETE l
        OUTPUT
            deleted.*
        FROM
            [rule].limit l
        JOIN
            @conditionId item ON l.conditionId = item.value

        SELECT 'commission' AS resultSetName
        DELETE
            c
        OUTPUT
            deleted.*
        FROM
            [rule].commission c
        JOIN
            @conditionId item ON c.conditionId = item.value

        SELECT 'condition' AS resultSetName
        DELETE
            c
        OUTPUT
            deleted.*
        FROM
            [rule].condition c
        JOIN
            @conditionId item ON c.conditionId = item.value
    COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH