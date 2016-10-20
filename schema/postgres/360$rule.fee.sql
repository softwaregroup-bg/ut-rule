CREATE TABLE rule.fee(
  "feeId" serial NOT NULL,
  "conditionId" integer NOT NULL,

  "startAmount" numeric NOT NULL,
  "startAmountCurrency" char(3) NOT NULL,
  "isSourceAmount" boolean NOT NULL,

  "minValue" numeric,
  "maxValue" numeric,
  "percent" float,
  "percentBase" numeric,

  CONSTRAINT "pkRuleFee" PRIMARY KEY ("feeId"),
  CONSTRAINT "fkRuleFee_condition" FOREIGN KEY ("conditionId") REFERENCES rule.condition ("conditionId") MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
)
