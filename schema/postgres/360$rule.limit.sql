CREATE TABLE rule."limit"(
  "limitId" serial NOT NULL,
  "conditionId" integer NOT NULL,
  "currency" char(3) NOT NULL,

  "minAmount" numeric,
  "maxAmount" numeric,

  "maxAmountDaily" numeric,
  "maxCountDaily" bigint,

  "maxAmountWeekly" numeric,
  "maxCountWeekly" bigint,

  "maxAmountMonthly" numeric,
  "maxCountMonthly" bigint,

  CONSTRAINT "pkRuleLimit" PRIMARY KEY ("limitId"),
  CONSTRAINT "fkRuleLimit_condition" FOREIGN KEY ("conditionId") REFERENCES rule.condition ("conditionId") MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
)
