ALTER VIEW [integration].[vChannel]
AS
SELECT
    1 channelId,
    CAST(NULL AS BIGINT) countryId,
    CAST(NULL AS BIGINT) regionId,
    CAST(NULL AS BIGINT) cityId,
    'Neverland' name
UNION ALL SELECT 2, [value], NULL, NULL, 'Andorra' FROM core.itemRow('country', 'Andorra')
UNION ALL SELECT 3, NULL, [value], NULL, 'Varna' FROM core.itemRow('region', 'Varna')
UNION ALL SELECT 4, NULL, NULL, [value], 'Topolovgrad' FROM core.itemRow('city', 'Topolovgrad')
