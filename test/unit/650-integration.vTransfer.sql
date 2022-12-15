ALTER VIEW [integration].[vTransfer]
AS
SELECT
    '' sourceAccount,
    CAST (1 AS BIT) success,
    CAST(0 AS MONEY) transferAmount,
    'USD' transferCurrency,
    CAST('2022-01-01 00:00:00Z' AS DATETIME) transferDateTime,
    1 transferTypeId
