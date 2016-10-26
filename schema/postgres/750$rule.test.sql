CREATE OR REPLACE FUNCTION rule."test"(
  "@test" json
)
RETURNS
    TABLE("isSingleResult" boolean, "test" json) AS
$BODY$
    SELECT
        TRUE AS "isSingleResult",
        "@test" AS "test"
$BODY$
LANGUAGE SQL