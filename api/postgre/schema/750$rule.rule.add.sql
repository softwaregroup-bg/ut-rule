CREATE OR REPLACE FUNCTION rule."rule.add"("@condition" json,
"@fee" json,
"@limit" json,
"@commission" json)
RETURNS TABLE(
    "isSingleResult" boolean,
    "condition" json,
    "fee" json,
    "limit" json,
    "commission" json
) AS
$BODY$
	declare
      "@conditionId" INT:=(SELECT nextval('rule."condition_conditionId_seq"'));
BEGIN
INSERT INTO
  rule.condition
(
  "conditionId",
  "priority",
  "channelCountryId",
  "channelRegionId",
  "channelCityId",
  "channelOrganizationId",
  "channelSupervisorId",
  "channelTag",
  "channelRoleId",
  "channelId",
  "operationId",
  "operationTag",
  "operationStartDate",
  "operationEndDate",
  "sourceCountryId",
  "sourceRegionId",
  "sourceCityId",
  "sourceOrganizationId",
  "sourceSupervisorId",
  "sourceTag",
  "sourceId",
  "sourceProductId",
  "sourceAccountId",
  "destinationCountryId",
  "destinationRegionId",
  "destinationCityId",
  "destinationOrganizationId",
  "destinationSupervisorId",
  "destinationTag",
  "destinationId",
  "destinationProductId",
  "destinationAccountId"
)
SELECT
  "@conditionId",
  CAST("conditionT"->>'priority'as integer),
  CAST("conditionT"->>'channelCountryId'as integer),
  CAST("conditionT"->>'channelRegionId'as integer),
  CAST("conditionT"->>'channelCityId'as integer),
  CAST("conditionT"->>'channelOrganizationId'as integer),
  CAST("conditionT"->>'channelSupervisorId'as integer),
  "conditionT"->>'channelTag',
  CAST("conditionT"->>'channelRoleId'as integer),
  CAST( "conditionT"->>'channelId'as integer),
  CAST( "conditionT"->>'operationId'as integer),
  "conditionT"->>'operationTag',
  CAST( "conditionT"->>'operationStartDate' as "timestamp"),
  CAST("conditionT"->>'operationEndDate'as "timestamp"),
  CAST("conditionT"->>'sourceCountryId'as integer),
  CAST("conditionT"->>'sourceRegionId'as integer),
  CAST("conditionT"->>'sourceCityId'as integer),
  CAST("conditionT"->>'sourceOrganizationId'as integer),
  CAST("conditionT"->>'sourceSupervisorId'as integer),
  "conditionT"->>'sourceTag',
  CAST("conditionT"->>'sourceId'as integer),
  CAST("conditionT"->>'sourceProductId'as integer),
  CAST("conditionT"->>'sourceAccountId'as integer),
  CAST("conditionT"->>'destinationCountryId'as integer),
  CAST("conditionT"->>'destinationRegionId'as integer),
  CAST("conditionT"->>'destinationCityId'as integer),
  CAST("conditionT"->>'destinationOrganizationId'as integer),
  CAST("conditionT"->>'destinationSupervisorId'as integer),
  "conditionT"->>'destinationTag',
  CAST("conditionT"->>'destinationId'as integer),
  CAST("conditionT"->>'destinationProductId'as integer),
  CAST("conditionT"->>'destinationAccountId'as integer)
FROM
  json_array_elements( "@condition" ) as "conditionT";

INSERT INTO
  rule.commission
(
  "conditionId",
  "startAmount",
  "startAmountCurrency",
  "isSourceAmount",
  "minValue",
  "maxValue",
  "percent",
  "percentBase",
  "split"
)
SELECT
  "@conditionId",
  CAST("commissionT"->>'startAmount' as numeric(20,2)),
  CAST("commissionT"->>'startAmountCurrency' as char(3)),
  CAST("commissionT"->>'isSourceAmount' as BOOLEAN),
  CAST("commissionT"->>'minValue'as numeric(20,2)),
  CAST("commissionT"->>'maxValue'as numeric(20,2)),
  CAST("commissionT"->>'percent' as double precision),
  CAST("commissionT"->>'percentBase' as double precision),
  CAST("commissionT"->>'split' as varchar)
FROM   json_array_elements( "@commission" ) as "commissionT" ;


INSERT INTO
  rule."limit"
(
  "conditionId",
  "currency",
  "minAmount",
  "maxAmount",
  "maxAmountDaily",
  "maxCountDaily",
  "maxAmountWeekly",
  "maxCountWeekly",
  "maxAmountMonthly",
  "maxCountMonthly"
)
SELECT
  "@conditionId",
  CAST( "limitT"->>'currency'as char(3)),
  CAST("limitT"->>'minAmount'as numeric(20,2)),
  CAST("limitT"->>'maxAmount'as numeric(20,2)),
  CAST("limitT"->>'maxAmountDaily'as numeric(20,2)),
  CAST("limitT"->>'maxCountDaily'as bigint),
  CAST("limitT"->>'maxAmountWeekly'as numeric(20,2)),
  CAST("limitT"->>'maxCountWeekly'as bigint),
  CAST("limitT"->>'maxAmountMonthly'as numeric(20,2)),
  CAST("limitT"->>'maxCountMonthly'as bigint)
FROM   json_array_elements( "@limit" ) as "limitT" ;

INSERT INTO
  rule.fee
(
  "conditionId",
  "startAmount",
  "startAmountCurrency",
  "isSourceAmount",
  "minValue",
  "maxValue",
  "percent",
  "percentBase",
  "split"
)
SELECT
  "@conditionId",
  CAST("feeT"->>'startAmount'as numeric(20,2)),
  CAST("feeT"->>'startAmountCurrency' as char(3)),
  CAST("feeT"->>'isSourceAmount' as BOOLEAN),
  CAST("feeT"->>'minValue'as numeric(20,2)),
  CAST("feeT"->>'maxValue'as numeric(20,2)),
  CAST("feeT"->>'percent' as double PRECISION),
  CAST("feeT"->>'percentBase' as double PRECISION),
  CAST("feeT"->>'split' as varchar)
FROM
  json_array_elements( "@fee" ) as "feeT" ;

RETURN QUERY
select * from rule."rule.fetch"(
    "@conditionId"
);
 END;
$BODY$
LANGUAGE plpgsql