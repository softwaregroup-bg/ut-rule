CREATE OR REPLACE FUNCTION rule."rule.edit"("@condition" json,
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
      "@conditionId" INT:=(SELECT CAST("conditionT"->>'conditionId'as integer) FROM   json_array_elements("@condition" ) as "conditionT");
BEGIN
update
  rule.condition c
set
  priority= CAST("conditionT"->>'priority'as integer),

  "channelCountryId"=CAST("conditionT"->>'channelCountryId'as integer),
  "channelRegionId"=CAST("conditionT"->>'channelRegionId'as integer),
  "channelCityId"=CAST("conditionT"->>'channelCityId'as integer),
  "channelOrganizationId"=CAST("conditionT"->>'channelOrganizationId'as integer),
  "channelSupervisorId"=CAST("conditionT"->>'channelSupervisorId'as integer),
  "channelTag"="conditionT"->>'channelTag',
  "channelRoleId"=CAST("conditionT"->>'channelRoleId'as integer),
 "channelId"=CAST( "conditionT"->>'channelId'as integer),
 "operationId"=CAST( "conditionT"->>'operationId'as integer),
  "operationTag"="conditionT"->>'operationTag',
 "operationStartDate"=CAST( "conditionT"->>'operationStartDate' as "timestamp"),
  "operationEndDate"=CAST("conditionT"->>'operationEndDate'as "timestamp"),
  "sourceCountryId"=CAST("conditionT"->>'sourceCountryId'as integer),
  "sourceRegionId"=CAST("conditionT"->>'sourceRegionId'as integer),
  "sourceCityId"=CAST("conditionT"->>'sourceCityId'as integer),
  "sourceOrganizationId"=CAST("conditionT"->>'sourceOrganizationId'as integer),
  "sourceSupervisorId"=CAST("conditionT"->>'sourceSupervisorId'as integer),
  "sourceTag"="conditionT"->>'sourceTag',
  "sourceId"=CAST("conditionT"->>'sourceId'as integer),
  "sourceProductId"=CAST("conditionT"->>'sourceProductId'as integer),
  "sourceAccountId"=CAST("conditionT"->>'sourceAccountId'as integer),
  "destinationCountryId"=CAST("conditionT"->>'destinationCountryId'as integer),
  "destinationRegionId"=CAST("conditionT"->>'destinationRegionId'as integer),
  "destinationCityId"=CAST("conditionT"->>'destinationCityId'as integer),
  "destinationOrganizationId"=CAST("conditionT"->>'destinationOrganizationId'as integer),
  "destinationSupervisorId"=CAST("conditionT"->>'destinationSupervisorId'as integer),
  "destinationTag"="conditionT"->>'destinationTag',
  "destinationId"=CAST("conditionT"->>'destinationId'as integer),
  "destinationProductId"=CAST("conditionT"->>'destinationProductId'as integer),
  "destinationAccountId"=CAST("conditionT"->>'destinationAccountId'as integer)
  FROM   json_array_elements( "@condition" ) as "conditionT"
where   c."conditionId"= CAST("conditionT"->>'conditionId'as integer);


update
  rule.commission c
set
  "startAmount"=CAST("commissionT"->>'startAmount' as numeric(20,2)),
  "startAmountCurrency"=CAST("commissionT"->>'startAmountCurrency' as char(3)),
  "isSourceAmount"=CAST("commissionT"->>'isSourceAmount' as BOOLEAN),
  "minValue"= CAST("commissionT"->>'minValue'as numeric(20,2)),
  "maxValue"=CAST("commissionT"->>'maxValue'as numeric(20,2)),
  percent= CAST("commissionT"->>'percent' as double precision),
  "percentBase"=CAST("commissionT"->>'percentBase' as double precision)

FROM   json_array_elements( "@commission" ) as "commissionT"
where c."commissionId"= CAST("commissionT"->>'commissionId'as integer)
AND c."conditionId"= CAST("commissionT"->>'conditionId'as integer) ;

update
  rule."limit" l
set
  currency=CAST( "limitT"->>'currency'as char(3)),
  "minAmount"=CAST("limitT"->>'minAmount'as numeric(20,2)),
  "maxAmount"=CAST("limitT"->>'maxAmount'as numeric(20,2)),
  "maxAmountDaily"=CAST("limitT"->>'maxAmountDaily'as numeric(20,2)),
  "maxCountDaily"=CAST("limitT"->>'maxCountDaily'as bigint),
  "maxAmountWeekly"=CAST("limitT"->>'maxAmountWeekly'as numeric(20,2)),
  "maxCountWeekly"=CAST("limitT"->>'maxCountWeekly'as bigint),
  "maxAmountMonthly"=CAST("limitT"->>'maxAmountMonthly'as numeric(20,2)),
  "maxCountMonthly"=CAST("limitT"->>'maxCountMonthly'as bigint)

FROM   json_array_elements( "@limit" ) as "limitT"
where l."limitId"= CAST("limitT"->>'limitId'as integer)
AND l."conditionId"= CAST("limitT"->>'conditionId'as integer) ;

update rule.fee f
set
  "startAmount"= CAST("feeT"->>'startAmount'as numeric(20,2)),
  "startAmountCurrency"=CAST("feeT"->>'startAmountCurrency' as char(3)),
  "isSourceAmount"=CAST("feeT"->>'isSourceAmount' as BOOLEAN),
  "minValue"=CAST("feeT"->>'minValue'as numeric(20,2)),
  "maxValue"=CAST("feeT"->>'maxValue'as numeric(20,2)),
  percent=CAST("feeT"->>'percent' as double PRECISION),
  "percentBase"= CAST("feeT"->>'percentBase' as double PRECISION)
FROM   json_array_elements( "@fee" ) as "feeT"
where f."feeId"= CAST("feeT"->>'feeId'as integer)
AND f."conditionId"= CAST("feeT"->>'conditionId'as integer) ;
RETURN QUERY
select * from rule."rule.fetch"(
    "@conditionId"
);
 END;
$BODY$
LANGUAGE plpgsql