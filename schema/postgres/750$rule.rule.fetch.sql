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
        json_agg("condition".*) AS "condition",
        json_agg("fee".*) AS "fee",
        json_agg("limit".*) AS "limit",
        json_agg("commission".*) AS "commission"
    FROM
        rule.condition AS "condition"
    LEFT JOIN
        rule.fee AS "fee" ON "fee"."conditionId" = "condition"."conditionId"
    LEFT JOIN
        rule.limit AS "limit" ON "limit"."conditionId" = "fee"."conditionId"
    LEFT JOIN
        rule.commission AS "commission" ON "commission"."conditionId" = "limit"."conditionId"
    WHERE
        "@conditionId" IS NULL OR "condition"."conditionId" = "@conditionId"
$BODY$
LANGUAGE SQL