CREATE OR REPLACE FUNCTION rule."decision.fetch"(
  IN "@channelCountryId" bigint,
  IN "@channelRegionId" bigint,
  IN "@channelCityId" bigint,
  IN "@channelOrganizationId" bigint,
  IN "@channelSupervisorId" bigint,
  IN "@channelTags" varchar(255),
  IN "@channelRoleId" bigint,
  IN "@channelId" bigint,
  IN "@operationId" bigint,
  IN "@operationTags" varchar(255),
  IN "@operationStartDate" timestamptz,
  IN "@operationEndDate" timestamptz,
  IN "@sourceCountryId" bigint,
  IN "@sourceRegionId" bigint,
  IN "@sourceCityId" bigint,
  IN "@sourceOrganizationId" bigint,
  IN "@sourceSupervisorId" bigint,
  IN "@sourceTags" varchar(255),
  IN "@sourceId" bigint,
  IN "@sourceProductId" bigint,
  IN "@sourceAccountId" bigint,
  IN "@destinationCountryId" bigint,
  IN "@destinationRegionId" bigint,
  IN "@destinationCityId" bigint,
  IN "@destinationOrganizationId" bigint,
  IN "@destinationSupervisorId" bigint,
  IN "@destinationTags" varchar(255),
  IN "@destinationId" bigint,
  IN "@destinationProductId" bigint,
  IN "@destinationAccountId" bigint,
  IN "@amount" money,
  IN "@currency" char(3),
  IN "@isSourceAmount" boolean
)
RETURNS
    TABLE("limits" json, "fees" json) AS
$BODY$
    WITH
    matches AS (
        SELECT
            "priority",
            "conditionId"
        FROM
            rule.condition c
        WHERE
            ("@channelCountryId" IS NULL OR "@channelCountryId" = c."channelCountryId") AND
            ("@channelRegionId" IS NULL OR "@channelRegionId" = c."channelRegionId") AND
            ("@channelCityId" IS NULL OR "@channelCityId" = c."channelCityId") AND
            ("@channelOrganizationId" IS NULL OR "@channelOrganizationId" = c."channelOrganizationId") AND
            ("@channelSupervisorId" IS NULL OR "@channelSupervisorId" = c."channelSupervisorId") AND
            ("@channelTags" IS NULL OR "@channelTags" LIKE ('%|' || c."channelTag" || '|%')) AND
            ("@channelRoleId" IS NULL OR "@channelRoleId" = c."channelRoleId") AND
            ("@channelId" IS NULL OR "@channelId" = c."channelId") AND
            ("@operationId" IS NULL OR "@operationId" = c."operationId") AND
            ("@operationTags" IS NULL OR "@operationTags" LIKE ('%|' || c."operationTag" || '|%')) AND
            ("@operationStartDate" IS NULL OR "@operationStartDate" = c."operationStartDate") AND
            ("@operationEndDate" IS NULL OR "@operationEndDate" = c."operationEndDate") AND
            ("@sourceCountryId" IS NULL OR "@sourceCountryId" = c."sourceCountryId") AND
            ("@sourceRegionId" IS NULL OR "@sourceRegionId" = c."sourceRegionId") AND
            ("@sourceCityId" IS NULL OR "@sourceCityId" = c."sourceCityId") AND
            ("@sourceOrganizationId" IS NULL OR "@sourceOrganizationId" = c."sourceOrganizationId") AND
            ("@sourceSupervisorId" IS NULL OR "@sourceSupervisorId" = c."sourceSupervisorId") AND
            ("@sourceTags" IS NULL OR "@sourceTags" LIKE ('%|' || c."sourceTag" || '|%')) AND
            ("@sourceId" IS NULL OR "@sourceId" = c."sourceId") AND
            ("@sourceProductId" IS NULL OR "@sourceProductId" = c."sourceProductId") AND
            ("@sourceAccountId" IS NULL OR "@sourceAccountId" = c."sourceAccountId") AND
            ("@destinationCountryId" IS NULL OR "@destinationCountryId" = c."destinationCountryId") AND
            ("@destinationRegionId" IS NULL OR "@destinationRegionId" = c."destinationRegionId") AND
            ("@destinationCityId" IS NULL OR "@destinationCityId" = c."destinationCityId") AND
            ("@destinationOrganizationId" IS NULL OR "@destinationOrganizationId" = c."destinationOrganizationId") AND
            ("@destinationSupervisorId" IS NULL OR "@destinationSupervisorId" = c."destinationSupervisorId") AND
            ("@destinationTags" IS NULL OR "@destinationTags" LIKE ('%|' || c."destinationTag" || '|%')) AND
            ("@destinationId" IS NULL OR "@destinationId" = c."destinationId") AND
            ("@destinationProductId" IS NULL OR "@destinationProductId" = c."destinationProductId") AND
            ("@destinationAccountId" IS NULL OR "@destinationAccountId" = c."destinationAccountId")
    ),
    limits AS (
        SELECT
            l."minAmount",
            l."maxAmount",
            l."maxCountDaily" AS "maxCount"
        FROM
            matches AS c
        JOIN
            rule.limit AS l ON l."conditionId" = c."conditionId"
        WHERE
            "@currency" = l."currency"
        ORDER BY
            c."priority",
            l."limitId"
        LIMIT 1
    ),
    fees AS (
        SELECT
            LEAST(
                f."maxValue",
                GREATEST(
                    COALESCE(f."minValue", CAST(0 AS MONEY)),
                    COALESCE(f."percent", CAST(0 AS float)) * (GREATEST("@amount", f."percentBase") - COALESCE(f."percentBase", CAST(0 AS MONEY))) / 100)) AS "fee"
        FROM
            matches AS c
        JOIN
            rule.fee AS f on f."conditionId" = c."conditionId"
        WHERE
            "@currency" = f."startAmountCurrency" AND
            COALESCE("@isSourceAmount", TRUE) = f."isSourceAmount" AND
            "@amount" >= f."startAmount"
        ORDER BY
            c."priority",
            f."startAmount",
            f."feeId"
        LIMIT 1
    )
    SELECT
        (SELECT json_agg(limits) FROM limits) AS limits,
        (SELECT json_agg(fees) FROM fees) AS fees
$BODY$
LANGUAGE SQL