ALTER PROCEDURE [rule].[operation.lookup]
    @operation varchar(100),
    @operationDate datetime
AS
    SELECT 'operation' AS resultSetName, 1 single
    SELECT
        n.itemNameId transferTypeId,
        ISNULL(@operationDate, GETDATE()) transferDateTime
    FROM
        [core].[itemName] n
    JOIN
        [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'operation'
    WHERE
        itemCode = @operation
