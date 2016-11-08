CREATE TABLE rule.condition(
  "conditionId" serial NOT NULL,
  "priority" integer,

  "channelCountryId" bigint,
  "channelRegionId" bigint,
  "channelCityId" bigint,
  "channelOrganizationId" bigint,
  "channelSupervisorId" bigint,
  "channelTag" varchar(255),
  "channelRoleId" bigint,
  "channelId" bigint,

  "operationId" bigint,
  "operationTag" varchar(255),
  "operationStartDate" timestamptz,
  "operationEndDate" timestamptz,

  "sourceCountryId" bigint,
  "sourceRegionId" bigint,
  "sourceCityId" bigint,
  "sourceOrganizationId" bigint,
  "sourceSupervisorId" bigint,
  "sourceTag" varchar(255),
  "sourceId" bigint,
  "sourceProductId" bigint,
  "sourceAccountId" bigint,

  "destinationCountryId" bigint,
  "destinationRegionId" bigint,
  "destinationCityId" bigint,
  "destinationOrganizationId" bigint,
  "destinationSupervisorId" bigint,
  "destinationTag" varchar(255),
  "destinationId" bigint,
  "destinationProductId" bigint,
  "destinationAccountId" bigint,

  CONSTRAINT "pkRuleCondition" PRIMARY KEY ("conditionId")
)
