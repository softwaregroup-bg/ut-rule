CREATE OR REPLACE FUNCTION rule."rule.fetch"(
    "@conditionId" integer
)
RETURNS TABLE(
    "isSingleResult" boolean,
    "condition" json,
    "fee" json,
    "limit" json,
    "commission" json
) AS
$BODY$
    SELECT
        true AS "isSingleResult",
        json_agg(DISTINCT "condition".*) AS "condition",
        json_agg(DISTINCT "fee".*) AS "fee",
        json_agg(DISTINCT "limit".*) AS "limit",
        json_agg(DISTINCT "commission".*) AS "commission"
    FROM
        rule.condition AS "condition"
    LEFT JOIN
        rule.fee AS "fee" ON "fee"."conditionId" = "condition"."conditionId"
    LEFT JOIN
        rule.limit AS "limit" ON "limit"."conditionId" = "condition"."conditionId"
    LEFT JOIN
        rule.commission AS "commission" ON "commission"."conditionId" = "condition"."conditionId"
    WHERE
        "@conditionId" IS NULL OR "condition"."conditionId" = "@conditionId"
$BODY$
LANGUAGE SQL
