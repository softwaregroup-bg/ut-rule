CREATE TABLE [rule].[conditionProperty] (
    conditionId INT NOT NULL,
    factor CHAR(2) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [value] NVARCHAR(200) NOT NULL,
    CONSTRAINT pkRuleConditionProperty PRIMARY KEY CLUSTERED (conditionId, factor, [name], [value]),
    CONSTRAINT fkRuleConditionProperty_conditionId FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId),
    CONSTRAINT ccRuleConditionProperty_factor2 CHECK (factor IN ('so', 'do', 'co', 'ss', 'ds', 'cs', 'oc', 'sc', 'dc', 'sk', 'st', 'dk', 'dt', 'tp'))
    -- source organization, destination organization, channel organization, source spatial, destination spatial, channel spatial, operation category, source category, destination category
    -- source kyc, source type, destination kyc, destination type
)
