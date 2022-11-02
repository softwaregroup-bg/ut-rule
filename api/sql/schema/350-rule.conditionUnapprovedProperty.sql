CREATE TABLE [rule].[conditionPropertyUnapproved] (
    conditionId INT NOT NULL,
    factor CHAR(2) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [value] NVARCHAR(200) NOT NULL,
    status VARCHAR(20) NULL DEFAULT('pending'),
    CONSTRAINT pkRuleConditionPropertyUnapproved PRIMARY KEY CLUSTERED (conditionId, factor, [name]),
    CONSTRAINT fkRuleConditionPropertyUnapproved_conditionId FOREIGN KEY (conditionId) REFERENCES [rule].[conditionUnapproved](conditionId),
    CONSTRAINT ccRuleConditionPropertyUnapproved_factor CHECK (factor IN ('so', 'do', 'co', 'ss', 'ds', 'cs', 'oc', 'sc', 'dc')),
    -- source organization, destination organization, channel organization, source spatial, destination spatial, channel spatial, operation category, source category, destination category
    CONSTRAINT fkRuleConditionPropertyUnapproved_status FOREIGN KEY(status) REFERENCES [core].[status] (statusId)
)
