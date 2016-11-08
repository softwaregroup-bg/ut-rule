CREATE OR REPLACE FUNCTION rule."rule.remove"("@conditionId" int[])
RETURNS TABLE(
    "isSingleResult" boolean,
    "condition" json,
    "fee" json,
    "limit" json,
    "commission" json
) AS
$BODY$
BEGIN
CREATE TEMP TABLE IF NOT EXISTS "tmpCondition" AS
     SELECT
        true AS "isSingleResult",
        json_agg(DISTINCT "condition".*) AS "condition",
        json_agg(DISTINCT "fee".*) AS "fee",
        json_agg(DISTINCT "limit".*) AS "limit",
        json_agg(DISTINCT "commission".*) AS "commission"
    FROM
        rule.condition AS "condition"
    JOIN
    	unnest("@conditionId") item on item="condition"."conditionId"
    LEFT JOIN
        rule.fee AS "fee" ON "fee"."conditionId" = "condition"."conditionId"
    LEFT JOIN
        rule.limit AS "limit" ON "limit"."conditionId" = "condition"."conditionId"
    LEFT JOIN
        rule.commission AS "commission" ON "commission"."conditionId" = "condition"."conditionId";


DELETE FROM rule.fee  f
USING unnest("@conditionId") item
WHERE f."conditionId" = item;

DELETE FROM rule."limit"  l
USING unnest("@conditionId") item
WHERE l."conditionId" = item;

DELETE FROM rule."commission"  c
USING unnest("@conditionId") item
WHERE c."conditionId" = item;

DELETE FROM rule."condition"  c
USING unnest("@conditionId") item
WHERE c."conditionId" = item;

RETURN QUERY
select * from "tmpCondition";
END;
$BODY$
LANGUAGE plpgsql