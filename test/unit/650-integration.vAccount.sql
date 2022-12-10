ALTER VIEW [integration].[vAccount] --view that shows information about all customer accounts
AS
SELECT
    '' customerNumber,
    1 accountTypeId,
    '' accountTypeName,
    'USD' currency,
    10000 availableBalance,
    20000 ledgerBalance,
    accountNumber,
    countryId,
    regionId,
    cityId,
    '' organizationId,
    ownerId,
    '' accountProductId,
    accountNumber accountId,
    '' accountCheckAmount,
    '' accountCheckMask,
    '' productCheckAmount,
    '' productCheckMask,
    'rule' AS issuerId
FROM (
    SELECT 'source' accountNumber, NULL countryId, NULL regionId, NULL cityId, NULL ownerId
    UNION ALL SELECT 'source-country', [value], NULL, NULL, NULL FROM core.itemRow('country', 'Angola')
    UNION ALL SELECT 'source-region', NULL, [value], NULL, NULL FROM core.itemRow('region', 'Pleven')
    UNION ALL SELECT 'source-city', NULL, NULL, [value], NULL FROM core.itemRow('city', 'Merichleri')
    UNION ALL SELECT 'source-organization', NULL, NULL, NULL, actorId FROM customer.organization WHERE organizationName = 'Mercy Corps'
    UNION ALL SELECT 'source-organization-tag', NULL, NULL, NULL, actorId FROM customer.organization WHERE organizationName = 'Tripadvisor'
) x
UNION ALL
SELECT
    '' customerNumber,
    1 accountTypeId,
    '' accountTypeName,
    'USD' currency,
    0 availableBalance,
    0 ledgerBalance,
    accountNumber,
    countryId,
    regionId,
    cityId,
    '' organizationId,
    ownerId,
    '' accountProductId,
    accountNumber accountId,
    '' accountCheckAmount,
    '' accountCheckMask,
    '' productCheckAmount,
    '' productCheckMask,
    'rule' AS issuerId
FROM (
    SELECT 'destination' accountNumber, NULL countryId, NULL regionId, NULL cityId, NULL ownerId
    UNION ALL SELECT 'destination-country', [value], NULL, NULL, NULL FROM core.itemRow('country', 'Senegal')
    UNION ALL SELECT 'destination-region', NULL, [value], NULL, NULL FROM core.itemRow('region', 'Yambol')
    UNION ALL SELECT 'destination-city', NULL, NULL, [value], NULL FROM core.itemRow('city', 'Ardino')
    UNION ALL SELECT 'destination-organization', NULL, NULL, NULL, actorId FROM customer.organization WHERE organizationName = 'Oxfam'
    UNION ALL SELECT 'destination-organization-tag', NULL, NULL, NULL, actorId FROM customer.organization WHERE organizationName = 'DHL'
) x
UNION ALL
SELECT
    '' customerNumber,
    1 accountTypeId,
    '' accountTypeName,
    'USD' currency,
    0 availableBalance,
    0 ledgerBalance,
    'current' accountNumber,
    '' countryId,
    '' regionId,
    '' cityId,
    '' organizationId,
    '' ownerId,
    '' accountProductId,
    'current' accountId,
    '' accountCheckAmount,
    '' accountCheckMask,
    '' productCheckAmount,
    '' productCheckMask,
    'rule' AS issuerId
