ALTER PROCEDURE [rule].[dropdown.list]
    @meta [core].[metaDataTT] READONLY
AS

DECLARE @userId BIGINT, @languageId BIGINT

SELECT @userId = [auth.actorId], @languageId = languageId
FROM @meta

IF @languageId IS NULL
BEGIN
    SELECT @languageId = ISNULL(u.primaryLanguageId, l.languageId)
    FROM [user].[user] u
    JOIN core.language l ON (l.languageId = u.primaryLanguageId OR (u.primaryLanguageId IS NULL AND l.iso2Code = 'en'))
    WHERE actorId = @userId
END

SELECT 'rule.currency' AS resultSetName
SELECT code [value], [label], [parent]
FROM core.item(@languageId, 'currency')

ORDER BY ISNULL(itemOrder, 99999), 2
SELECT 'rule.country' AS resultSetName
SELECT [value], [label], [parent]
FROM core.item(@languageId, 'country')
ORDER BY ISNULL(itemOrder, 99999), 2

SELECT 'rule.region' AS resultSetName
SELECT [value], [label], [parent]
FROM core.item(@languageId, 'region')
ORDER BY ISNULL(itemOrder, 99999), 2

SELECT 'rule.city' AS resultSetName
SELECT [value], [label], [parent]
FROM core.item(@languageId, 'city')
ORDER BY ISNULL(itemOrder, 99999), 2

SELECT 'rule.accountProduct' AS resultSetName
SELECT [value], [label], [parent]
FROM core.item(@languageId, 'accountProduct')
ORDER BY ISNULL(itemOrder, 99999), 2

SELECT 'rule.cardProduct' AS resultSetName
SELECT [value], [label], [parent]
FROM core.item(@languageId, 'cardProduct')
ORDER BY ISNULL(itemOrder, 99999), 2

SELECT 'rule.channel' AS resultSetName
SELECT [value], [label], [parent]
FROM core.item(@languageId, 'channel')
ORDER BY ISNULL(itemOrder, 99999), 2

SELECT 'rule.role' AS resultSetName
SELECT [value], [label], [parent]
FROM core.item(@languageId, 'role')
ORDER BY ISNULL(itemOrder, 99999), 2

SELECT 'rule.operation' AS resultSetName
SELECT [value], [label], [parent]
FROM core.item(@languageId, 'operation')
ORDER BY ISNULL(itemOrder, 99999), 2

SELECT 'rule.kyc' AS resultSetName
SELECT [value], [label], [parent]
FROM [rule].vKyc

SELECT 'rule.customerType' AS resultSetName
SELECT [value], [label]
FROM [rule].vCustomerType
