CREATE OR REPLACE FUNCTION rule."rule.fetch"(
    "@conditionId" integer
)
RETURNS TABLE(
    "isSingleResult" boolean,
    "data" json
) AS
$BODY$
    WITH
        result AS (
            SELECT
                *
            FROM
                rule.condition con
            LEFT JOIN
                rule.commission com ON con."conditionId" = com."conditionId"
            LEFT JOIN
                rule.fee f ON con."conditionId" = f."conditionId"
            LEFT JOIN
                rule.limit l ON f."conditionId" = l."conditionId"
            WHERE "@conditionId" IS NULL OR con."conditionId" = "@conditionId"

        )
        SELECT
            true AS "isSingleResult",
            array_to_json(array_agg(result)) as "data"
        FROM result

$BODY$
LANGUAGE SQL