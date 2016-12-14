CREATE OR REPLACE FUNCTION rule."rule.edit"(
  "@condition" json,
  "@fee" json,
  "@limit" json,
  "@commission" json
) RETURNS TABLE (
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

DELETE FROM rule.fee f
WHERE f."conditionId"="@conditionId"
AND f."feeId" NOT IN(SELECT CAST("feeT"->>'feeId'as integer)
							FROM   json_array_elements( "@fee" ) as "feeT"
                           --WHERE   CAST("feeT"->>'conditionId'as integer)="@conditionId"
						);


DELETE FROM rule.commission  c
WHERE c."conditionId"="@conditionId"
AND c."commissionId" NOT IN(SELECT CAST("commissionT"->>'commissionId'as integer)
							FROM   json_array_elements( "@commission" ) as "commissionT"
                            --WHERE   CAST("commissionT"->>'conditionId'as integer)="@conditionId"
                              );

DELETE FROM rule."limit"  l
WHERE l."conditionId"="@conditionId"
AND l."limitId" NOT IN(SELECT CAST("limitT"->>'limitId'as integer)
							FROM   json_array_elements( "@limit" ) as "limitT"
                        	--WHERE   CAST("limitT"->>'conditionId'as integer)="@conditionId"
                              );

update
  rule.condition c
set
  "priority"= CAST("conditionT"->>'priority'as integer),
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
FROM
  json_array_elements( "@condition" ) as "conditionT"
where
  c."conditionId"= CAST("conditionT"->>'conditionId'as integer);

update
  rule.commission c
set
  "startAmount"=CAST("commissionT"->>'startAmount' as numeric(20,2)),
  "startAmountCurrency"=CAST("commissionT"->>'startAmountCurrency' as char(3)),
  "isSourceAmount"=CAST("commissionT"->>'isSourceAmount' as BOOLEAN),
  "minValue"= CAST("commissionT"->>'minValue'as numeric(20,2)),
  "maxValue"=CAST("commissionT"->>'maxValue'as numeric(20,2)),
  "percent"= CAST("commissionT"->>'percent' as double precision),
  "percentBase"=CAST("commissionT"->>'percentBase' as double precision),
  "split"=CAST("commissionT"->>'split' as varchar)

FROM json_array_elements( "@commission" ) as "commissionT"
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
  "percent"=CAST("feeT"->>'percent' as double PRECISION),
  "percentBase"= CAST("feeT"->>'percentBase' as double PRECISION),
  "split"= CAST("feeT"->>'split' as varchar)
FROM   json_array_elements( "@fee" ) as "feeT"
where f."feeId"= CAST("feeT"->>'feeId'as integer)
AND f."conditionId"= CAST("feeT"->>'conditionId'as integer) ;



INSERT INTO rule.commission (
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
  CAST("commissionT"->>'conditionId'as integer),
  CAST("commissionT"->>'startAmount' as numeric(20,2)),
  CAST("commissionT"->>'startAmountCurrency' as char(3)),
  CAST("commissionT"->>'isSourceAmount' as BOOLEAN),
  CAST("commissionT"->>'minValue'as numeric(20,2)),
  CAST("commissionT"->>'maxValue'as numeric(20,2)),
  CAST("commissionT"->>'percent' as double precision),
  CAST("commissionT"->>'percentBase' as double precision),
  CAST("commissionT"->>'split' as varchar)
FROM
  json_array_elements( "@commission" ) as "commissionT"
where CAST("commissionT"->>'commissionId'as integer) is null;



INSERT INTO rule."limit" (
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
    CAST("limitT"->>'conditionId'as integer),
    CAST( "limitT"->>'currency'as char(3)),
    CAST("limitT"->>'minAmount'as numeric(20,2)),
    CAST("limitT"->>'maxAmount'as numeric(20,2)),
    CAST("limitT"->>'maxAmountDaily'as numeric(20,2)),
    CAST("limitT"->>'maxCountDaily'as bigint),
    CAST("limitT"->>'maxAmountWeekly'as numeric(20,2)),
    CAST("limitT"->>'maxCountWeekly'as bigint),
    CAST("limitT"->>'maxAmountMonthly'as numeric(20,2)),
    CAST("limitT"->>'maxCountMonthly'as bigint)
FROM
  json_array_elements( "@limit" ) as "limitT"
where
  CAST("limitT"->>'limitId'as integer) IS NULL  ;


INSERT INTO rule.fee (
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
  CAST("feeT"->>'conditionId'as integer),
  CAST("feeT"->>'startAmount'as numeric(20,2)),
  CAST("feeT"->>'startAmountCurrency' as char(3)),
  CAST("feeT"->>'isSourceAmount' as BOOLEAN),
  CAST("feeT"->>'minValue'as numeric(20,2)),
  CAST("feeT"->>'maxValue'as numeric(20,2)),
  CAST("feeT"->>'percent' as double PRECISION),
  CAST("feeT"->>'percentBase' as double PRECISION),
  CAST("feeT"->>'split' as varchar)
FROM
  json_array_elements( "@fee" ) as "feeT"
where
  CAST("feeT"->>'feeId'as integer) IS NULL;

RETURN QUERY
select * from rule."rule.fetch"(
    "@conditionId"
);
 END;
$BODY$
LANGUAGE plpgsql