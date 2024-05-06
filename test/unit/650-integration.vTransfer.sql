ALTER VIEW [integration].[vTransfer]
AS
SELECT
    '' sourceAccount,
    CAST (1 AS BIT) success,
    CAST(0 AS MONEY) transferAmount,
    'USD' transferCurrency,
    CAST(0 AS MONEY) settlementAmount,
    'AUD' settlementAmountCurrency,
    CAST(0 AS MONEY) accountAmount,
    'BGN' accountAmountCurrency,
    CAST('2022-01-01T00:00:00Z' AS DATETIME) transferDateTime,
    1 transferTypeId
