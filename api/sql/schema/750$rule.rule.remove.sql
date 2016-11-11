ALTER PROCEDURE [rule].[rule.remove]
    @conditionId core.arrayList READONLY
AS
BEGIN TRY
    IF OBJECT_ID('tempdb..#tmpCondition') IS NOT NULL
        /*Then it exists*/
        DROP TABLE #tmpCondition
    SELECT c.*
    INTO #tmpCondition
    FROM [rule].condition c
    JOIN @conditionId item ON c.conditionId = item.value


    IF OBJECT_ID('tempdb..#tmpFee') IS NOT NULL
        /*Then it exists*/
        DROP TABLE #tmpFee
    SELECT f.*
    INTO #tmpFee
    FROM [rule].fee f
    JOIN @conditionId item ON f.conditionId = item.value

    IF OBJECT_ID('tempdb..#tmpLimit') IS NOT NULL
        /*Then it exists*/
        DROP TABLE #tmpLimit
    SELECT l.*
    INTO #tmpLimit
    FROM [rule].limit l
    JOIN @conditionId item ON l.conditionId = item.value

    IF OBJECT_ID('tempdb..#tmpCommission') IS NOT NULL
        /*Then it exists*/
        DROP TABLE #tmpCommission
    SELECT c.*
    INTO #tmpCommission
    FROM [rule].commission c
    JOIN @conditionId item ON c.conditionId = item.value

    BEGIN TRANSACTION

        DELETE f
        FROM [rule].fee f
        JOIN @conditionId item ON f.conditionId = item.value

        DELETE l
        FROM [rule].limit l
        JOIN @conditionId item ON l.conditionId = item.value

        DELETE c
        FROM [rule].commission c
        JOIN @conditionId item ON c.conditionId = item.value

        DELETE c
        FROM [rule].condition c
        JOIN @conditionId item ON c.conditionId = item.value

    COMMIT TRANSACTION

    SELECT 'condition' AS resultSetName
    SELECT * FROM #tmpCondition

    SELECT 'limit' AS resultSetName
    SELECT * FROM #tmpLimit

    SELECT 'commission' AS resultSetName
    SELECT * FROM #tmpCommission

    SELECT 'fee' AS resultSetName
    SELECT * FROM #tmpFee
END TRY

BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH