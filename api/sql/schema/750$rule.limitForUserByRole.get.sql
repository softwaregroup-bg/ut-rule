ALTER PROCEDURE [rule].[limitForUserByRole.get] --retrieve the rule limits set per user role, operation and currency
    @userId BIGINT, --actor id of the channel performing the operation
    @operation VARCHAR(100) = 'loanApplicationApprove', --operation executed
    @currency VARCHAR(3) = 'USD', --limit currency
    @property NVARCHAR (50) = 'loanApprovalLevel' -- condition property
AS
DECLARE @operationId BIGINT = (
    SELECT n.itemNameId
    FROM [core].[itemName] n
    JOIN [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'operation'
    WHERE itemCode = @operation)

DECLARE @maxApprovalAmount MONEY
DECLARE @maxApprovalLevel NVARCHAR(200)

--select the max amount and level from all limits for operation per currency and property
SELECT TOP 1 
    @maxApprovalLevel = cp.value,
    @maxApprovalAmount = l.maxAmount
FROM [rule].condition c
JOIN [rule].conditionItem ci ON ci.conditionId = c.conditionId
JOIN [rule].conditionProperty cp ON cp.conditionId = ci.conditionId
JOIN [rule].limit l ON l.conditionId = cp.conditionId
WHERE ci.itemNameId = @operationId
    AND l.currency = @currency
    AND cp.factor = 'co'
    AND cp.[name] = @property    
ORDER BY c.priority

SELECT TOP 1 l.currency, l.maxAmount AS approvalAmount, cp.value AS approvalLevel,
    @maxApprovalAmount AS maxApprovalAmount, @maxApprovalLevel AS maxApprovalLevel
FROM [rule].condition c
JOIN [rule].conditionActor ca ON ca.conditionId = c.conditionId
JOIN [rule].conditionItem ci ON ci.conditionId = ca.conditionId
JOIN [rule].conditionProperty cp ON cp.conditionId = ci.conditionId
JOIN [rule].limit l ON l.conditionId = cp.conditionId
JOIN core.actorHierarchy h ON ca.actorId = h.[object] AND h.[subject] = @userId
JOIN [user].[role] ur ON h.[object] = ur.actorId AND ur.isEnabled = 1
WHERE ci.itemNameId = @operationId
    AND l.currency = @currency
    AND cp.factor = 'co'
    AND ca.factor = 'co'
    AND cp.[name] = @property    
    AND h.[predicate] = 'role'
ORDER BY c.priority

