ALTER PROCEDURE [rule].[rule.remove]
    @conditionId core.arrayList READONLY
AS
BEGIN TRY
    BEGIN TRANSACTION
        SELECT 'limit' AS resultSetName
        DELETE x
        OUTPUT
            deleted.*
        FROM
            [rule].limit x
        JOIN
            @conditionId item ON x.conditionId = item.value

        SELECT 'conditionActor' AS resultSetName
        DELETE x
        OUTPUT
            deleted.*
        FROM
            [rule].conditionActor x
        JOIN
            @conditionId item ON x.conditionId = item.value

        SELECT 'conditionItem' AS resultSetName
        DELETE x
        OUTPUT 
            deleted.*    
        FROM 
            [rule].conditionItem x
        JOIN
            @conditionId item ON x.conditionId = item.value
    
        SELECT 'conditionProperty' AS resultSetName
        DELETE x
        OUTPUT 
            deleted.*    
        FROM 
            [rule].conditionProperty x
        JOIN
            @conditionId item ON x.conditionId = item.value

        SELECT 'splitRange' AS resultSetName
        DELETE
            x
        OUTPUT
            deleted.*
        FROM
            [rule].splitRange x
        JOIN
            [rule].splitName s ON s.splitNameId = x.splitNameId
        JOIN
            @conditionId item ON s.conditionId = item.value

        SELECT 'splitAssignment' AS resultSetName
        DELETE
            x
        OUTPUT
            deleted.*
        FROM
            [rule].splitAssignment x
        JOIN
            [rule].splitName s ON s.splitNameId = x.splitNameId
        JOIN
            @conditionId item ON s.conditionId = item.value

        SELECT 'splitName' AS resultSetName
        DELETE
            x
        OUTPUT
            deleted.*
        FROM
            [rule].splitName x
        JOIN
            @conditionId item ON x.conditionId = item.value

        SELECT 'condition' AS resultSetName
        DELETE
            x
        OUTPUT
            deleted.*
        FROM
            [rule].condition x
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