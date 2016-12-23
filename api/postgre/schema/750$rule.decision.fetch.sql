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
  IN "@operationDate" timestamptz,
  IN "@sourceCountryId" bigint,
  IN "@sourceRegionId" bigint,
  IN "@sourceCityId" bigint,
  IN "@sourceOrganizationId" bigint,
  IN "@sourceSupervisorId" bigint,
  IN "@sourceTags" varchar(255),
  IN "@sourceId" bigint,
  IN "@sourceCardProductId" bigint,
  IN "@sourceAccountProductId" bigint,
  IN "@sourceAccountId" bigint,
  IN "@destinationCountryId" bigint,
  IN "@destinationRegionId" bigint,
  IN "@destinationCityId" bigint,
  IN "@destinationOrganizationId" bigint,
  IN "@destinationSupervisorId" bigint,
  IN "@destinationTags" varchar(255),
  IN "@destinationId" bigint,
  IN "@destinationAccountProductId" bigint,
  IN "@destinationAccountId" bigint,
  IN "@amount" numeric(20,2),
  IN "@currency" char(3),
  IN "@isSourceAmount" boolean
)
RETURNS
    TABLE(
        "isSingleResult" boolean,
        "limit" json,
        "fee" json,
        "commission" json
    ) AS
$BODY$
    WITH
    matches AS (
        SELECT
            "priority",
            "conditionId"
        FROM
            rule.condition c
        WHERE
            ("@channelCountryId" IS NULL OR c."channelCountryId" IS NULL OR "@channelCountryId" = c."channelCountryId") AND
            ("@channelRegionId" IS NULL OR c."channelRegionId" IS NULL OR "@channelRegionId" = c."channelRegionId") AND
            ("@channelCityId" IS NULL OR c."channelCityId" IS NULL OR "@channelCityId" = c."channelCityId") AND
            ("@channelOrganizationId" IS NULL OR c."channelOrganizationId" IS NULL OR "@channelOrganizationId" = c."channelOrganizationId") AND
            ("@channelSupervisorId" IS NULL OR c."channelSupervisorId" IS NULL OR "@channelSupervisorId" = c."channelSupervisorId") AND
            ("@channelTags" IS NULL OR c."channelTag" IS NULL OR "@channelTags" LIKE ('%|' || c."channelTag" || '|%')) AND
            ("@channelRoleId" IS NULL OR c."channelRoleId" IS NULL OR "@channelRoleId" = c."channelRoleId") AND
            ("@channelId" IS NULL OR c."channelId" IS NULL OR "@channelId" = c."channelId") AND
            ("@operationId" IS NULL OR c."operationId" IS NULL OR "@operationId" = c."operationId") AND
            ("@operationTags" IS NULL OR c."operationTag" IS NULL OR "@operationTags" LIKE ('%|' || c."operationTag" || '|%')) AND
            ("@operationDate" IS NULL OR c."operationStartDate" IS NULL OR ("@operationDate" >= c."operationStartDate")) AND
            ("@operationDate" IS NULL OR c."operationEndDate" IS NULL OR ("@operationDate" <= c."operationEndDate")) AND
            ("@sourceCountryId" IS NULL OR c."sourceCountryId" IS NULL OR "@sourceCountryId" = c."sourceCountryId") AND
            ("@sourceRegionId" IS NULL OR c."sourceRegionId" IS NULL OR "@sourceRegionId" = c."sourceRegionId") AND
            ("@sourceCityId" IS NULL OR c."sourceCityId" IS NULL OR "@sourceCityId" = c."sourceCityId") AND
            ("@sourceOrganizationId" IS NULL OR c."sourceOrganizationId" IS NULL OR "@sourceOrganizationId" = c."sourceOrganizationId") AND
            ("@sourceSupervisorId" IS NULL OR c."sourceSupervisorId" IS NULL OR "@sourceSupervisorId" = c."sourceSupervisorId") AND
            ("@sourceTags" IS NULL OR c."sourceTag" IS NULL OR "@sourceTags" LIKE ('%|' || c."sourceTag" || '|%')) AND
            ("@sourceId" IS NULL OR c."sourceId" IS NULL OR "@sourceId" = c."sourceId") AND
            ("@sourceCardProductId" IS NULL OR c."sourceCardProductId" IS NULL OR "@sourceCardProductId" = c."sourceCardProductId") AND
            ("@sourceAccountProductId" IS NULL OR c."sourceAccountProductId" IS NULL OR "@sourceAccountProductId" = c."sourceAccountProductId") AND
            ("@sourceAccountId" IS NULL OR c."sourceAccountId" IS NULL OR "@sourceAccountId" = c."sourceAccountId") AND
            ("@destinationCountryId" IS NULL OR c."destinationCountryId" IS NULL OR "@destinationCountryId" = c."destinationCountryId") AND
            ("@destinationRegionId" IS NULL OR c."destinationRegionId" IS NULL OR "@destinationRegionId" = c."destinationRegionId") AND
            ("@destinationCityId" IS NULL OR c."destinationCityId" IS NULL OR "@destinationCityId" = c."destinationCityId") AND
            ("@destinationOrganizationId" IS NULL OR c."destinationOrganizationId" IS NULL OR "@destinationOrganizationId" = c."destinationOrganizationId") AND
            ("@destinationSupervisorId" IS NULL OR c."destinationSupervisorId" IS NULL OR "@destinationSupervisorId" = c."destinationSupervisorId") AND
            ("@destinationTags" IS NULL OR c."destinationTag" IS NULL OR "@destinationTags" LIKE ('%|' || c."destinationTag" || '|%')) AND
            ("@destinationId" IS NULL OR c."destinationId" IS NULL OR "@destinationId" = c."destinationId") AND
            ("@destinationAccountProductId" IS NULL OR c."destinationAccountProductId" IS NULL OR "@destinationAccountProductId" = c."destinationAccountProductId") AND
            ("@destinationAccountId" IS NULL OR c."destinationAccountId" IS NULL OR "@destinationAccountId" = c."destinationAccountId")
    ),
    limits AS (
        SELECT
            l."minAmount",
            l."maxAmount",
            l."maxCountDaily" AS "count"
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
                    0,
                    f."minValue",
                    COALESCE(f."percent", CAST(0 AS float)) * (GREATEST("@amount", f."percentBase") - COALESCE(f."percentBase", 0)) / 100)) AS "amount"
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
            f."startAmount" DESC,
            f."feeId"
        LIMIT 1
    ),
    commissions AS (
        SELECT
            LEAST(
                com."maxValue",
                GREATEST(
                    0,
                    com."minValue",
                    COALESCE(com."percent", CAST(0 AS float)) * (GREATEST("@amount", com."percentBase") - COALESCE(com."percentBase", 0)) / 100)) AS "amount"
        FROM
            matches AS c
        JOIN
            rule.commission AS com on com."conditionId" = c."conditionId"
        WHERE
            "@currency" = com."startAmountCurrency" AND
            COALESCE("@isSourceAmount", TRUE) = com."isSourceAmount" AND
            "@amount" >= com."startAmount"
        ORDER BY
            c."priority",
            com."startAmount" DESC,
            com."commissionId"
        LIMIT 1
    )
    SELECT
        TRUE "isSingleResult",
        (SELECT json_agg(limits)->0 FROM limits) AS "limit",
        (SELECT json_agg(fees)->0 FROM fees) AS "fee",
        (SELECT json_agg(commissions)->0 FROM commissions) AS "commission"
$BODY$
LANGUAGE SQL