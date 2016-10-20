CREATE TABLE rule."limit"(
  "limitId" serial NOT NULL,
  "conditionId" integer NOT NULL,
  "currency" char(3) NOT NULL,

  "minAmount" numeric(20,2),
  "maxAmount" numeric(20,2),

  "maxAmountDaily" numeric(20,2),
  "maxCountDaily" bigint,

  "maxAmountWeekly" numeric(20,2),
  "maxCountWeekly" bigint,

  "maxAmountMonthly" numeric(20,2),
  "maxCountMonthly" bigint,

  CONSTRAINT "pkRuleLimit" PRIMARY KEY ("limitId"),
  CONSTRAINT "fkRuleLimit_condition" FOREIGN KEY ("conditionId") REFERENCES rule.condition ("conditionId") MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
)
