CREATE PROCEDURE [rule].[limit.get] --retrieve the rule limits set per user role, operation and currency
    @channelId BIGINT, --actor id of the channel performing the operation
    @operation VARCHAR(100) = 'loanApplicationApprove', --operation executed
    @currency VARCHAR(3) = 'USD', --limit currency
    @property NVARCHAR (50) = 'loanApprovalLevel' -- condition property
AS
DECLARE @operationId BIGINT = (
    SELECT n.itemNameId
    FROM [core].[itemName] n
    JOIN [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'operation'
    WHERE itemCode = @operation)

DECLARE @userRoles AS TABLE (factor CHAR(2), actorId BIGINT)

INSERT INTO @userRoles (factor, actorId)
SELECT 'co', actorId
FROM [user].[actorRelatedRoles] (@channelId)
WHERE level = 1

SELECT TOP 1 l.currency, l.maxAmount AS approvalAmount, cp.value AS approvalLevel
FROM [rule].condition c
JOIN [rule].conditionActor ca ON ca.conditionId = c.conditionId
JOIN [rule].conditionItem ci ON ci.conditionId = ca.conditionId
JOIN [rule].conditionProperty cp ON cp.conditionId = ci.conditionId
JOIN [rule].limit l ON l.conditionId = cp.conditionId
JOIN @userRoles ur ON ur.factor = ca.factor AND ca.actorId = ur.actorId
WHERE ci.itemNameId = @operationId
    AND l.currency = @currency
    AND cp.factor = 'co'
    AND cp.name = @property
ORDER BY c.priority
