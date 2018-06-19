ALTER PROCEDURE [rule].[limitForUserByRole.get] --retrieve the rule limits set per user role, operation and currency
    @userId BIGINT, --actor id of the channel performing the operation
    @operation VARCHAR(100) = 'loanApplicationApprove', --operation executed
    @currency VARCHAR(3) = 'USD', --limit currency
    @property NVARCHAR (50) = 'loanApprovalLevel', -- condition property
    @nextLevel BIT = 0 -- flag if next level limit is searched
AS
DECLARE @operationId BIGINT = (
    SELECT n.itemNameId
    FROM [core].[itemName] n
    JOIN [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'operation'
    WHERE itemCode = @operation)

DECLARE @minApprovalAmount MONEY -- max approval amount for the system
DECLARE @maxApprovalAmount MONEY -- max approval amount for the system
DECLARE @maxApprovalLevel NVARCHAR(200) -- max approval level for the system
DECLARE @roleId BIGINT -- role of the user
DECLARE @maxAmount MONEY -- max approval amount for the user role
DECLARE @nextLevelRoleId BIGINT -- the id of the role with next higher limit

IF OBJECT_ID('tempdb..#temp') IS NOT NULL
    DROP TABLE #temp

SELECT
    ur.name,
    ur.actorId,
    l.currency,
    l.minAmount,
    l.maxAmount,
    cp.value AS approvalLevel,
    c.priority
INTO #temp
FROM [rule].condition c
JOIN [rule].conditionActor ca ON ca.conditionId = c.conditionId
JOIN [rule].conditionItem ci ON ci.conditionId = ca.conditionId
JOIN [rule].conditionProperty cp ON cp.conditionId = ci.conditionId
JOIN [rule].limit l ON l.conditionId = cp.conditionId
JOIN [user].[role] ur ON ca.actorId = ur.actorId AND ur.isEnabled = 1
WHERE ci.itemNameId = @operationId
    AND l.currency = @currency
    AND cp.factor = 'co'
    AND ca.factor = 'co'
    AND cp.[name] = @property

-- get user role and max approval amount
SELECT TOP 1
    @roleId = t.actorId,
    @maxAmount = t.maxAmount,
    @nextLevelRoleId = t2.actorId
FROM #temp t
CROSS APPLY
(
    SELECT
        r.actorId
    FROM
        core.actorGraph(@userId, 'memberOf', 'subject') g
    CROSS APPLY
        core.actorGraph(g.actorId, 'role', 'subject') r
    WHERE
        t.actorId = r.actorId
) h
LEFT JOIN #temp t2 ON t2.minAmount = t.maxAmount
ORDER BY t.minAmount DESC

-- if executed by user not in the approval hierarchy, get the lowest level
IF @roleId IS NULL
    SET @nextLevelRoleId = (SELECT TOP 1 actorId FROM #temp ORDER BY minAmount)

-- get max approval amount and max approval level for the system
SELECT TOP 1
    @maxApprovalAmount = maxAmount,
    @maxApprovalLevel = approvalLevel
FROM #temp
ORDER BY minAmount DESC

SELECT TOP 1
    @minApprovalAmount = minAmount
FROM #temp
ORDER BY minAmount ASC

IF ISNULL(@nextLevel, 0) = 0 -- return user role limits and level and max approval amount and max approval level for the system
BEGIN
    SELECT
        currency,
        minAmount,
        maxAmount,
        approvalLevel,
        @minApprovalAmount AS minApprovalAmount,
        @maxApprovalAmount AS maxApprovalAmount,
        @maxApprovalLevel AS maxApprovalLevel
    FROM #temp
    WHERE actorId = @roleId
END
ELSE -- return next level limits and list of users with that role
BEGIN
    SELECT
        name,
        actorId AS roleId,
        currency,
        minAmount,
        maxAmount,
        approvalLevel,
        @minApprovalAmount AS minApprovalAmount,
        @maxApprovalAmount AS maxApprovalAmount,
        @maxApprovalLevel AS maxApprovalLevel
    FROM #temp t
    WHERE actorId = @nextLevelRoleId

    SELECT
        p.actorId,
        p.firstName + ' ' + p.lastName AS userName
    FROM
    (
        SELECT
            r.actorId
        FROM
            core.actorGraph(@nextLevelRoleId, 'role', 'object') g
        CROSS APPLY
            core.actorGraph(g.actorId, 'memberof', 'object') r
    ) ah
    JOIN customer.person p ON p.actorId = ah.actorId
END

DROP TABLE #temp
