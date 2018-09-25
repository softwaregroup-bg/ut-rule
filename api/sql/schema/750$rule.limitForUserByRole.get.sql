ALTER PROCEDURE [rule].[limitForUserByRole.get] --retrieve the rule limits set per user role, operation and currency and users
    @userId BIGINT, --actor id of the checked user
    @operation VARCHAR(100) = 'loanApplicationApprove', --operation executed
    @currency VARCHAR(3) = 'USD', --limit currency
    @property NVARCHAR (50) = 'loanApprovalLevel', -- condition property
    @nextLevel BIT = 0, -- flag if next level limit is searched
    @approvedAmount MONEY = NULL, -- already approved amount
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS

DECLARE @operationId BIGINT = (
    SELECT n.itemNameId
    FROM [core].[itemName] n
    JOIN [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'operation'
    WHERE itemCode = @operation)

DECLARE @actorId BIGINT = (SELECT [auth.actorId] FROM @meta) -- id of the logged user
DECLARE @minApprovalAmount MONEY -- max approval amount for the system
DECLARE @maxApprovalAmount MONEY -- max approval amount for the system
DECLARE @maxApprovalLevel NVARCHAR(200) -- max approval level for the system
DECLARE @roleId BIGINT -- role of the user
DECLARE @nextLevelRoleId BIGINT -- the id of the role with next higher limit

BEGIN TRY

    IF @userId IS NULL
        SET @userId = @actorId
    ELSE IF @userId <> @actorId
    BEGIN
        --check if logged user is not on higher level than passed user and that both users are in the same hierarchy
        IF NOT EXISTS (
        SELECT hf.subject
        FROM [core].[actorHierarchy] h
        INNER JOIN [customer].[organizationHierarchyFlat] hf ON hf.[object] = h.[object]
        INNER JOIN [core].[actorHierarchy] u ON u.object = hf.subject
        WHERE h.[subject] = @actorId
            AND h.[predicate] = 'memberOf'
            AND u.[subject] = @userId
            AND u.[predicate] = 'memberOf')
                RAISERROR ('rule.securityViolation', 16, 1)
    END

    IF OBJECT_ID('tempdb..#temp') IS NOT NULL
        DROP TABLE #temp

    --select all roles visible for the checked user
    SELECT DISTINCT
        ur.name,
        ur.actorId,
        l.currency,
        l.minAmount,
        l.maxAmount,
        cp.value AS approvalLevel,
        c.priority
    INTO #temp
    FROM
    (
        SELECT DISTINCT r.actorId, g.Level -- all BUs in the hierarchy of user BU and userId
        FROM core.actorGraph(@userId, 'memberOf', 'subject') g
        CROSS APPLY
        (
            SELECT DISTINCT r.actorId -- all roles assigned for the BUs
            FROM core.actorGraph(g.ActorId, 'role', 'subject') r

            UNION ALL

            SELECT DISTINCT h.subject roleId -- all roles visible for the BUs
            FROM core.actorHierarchy h
            WHERE h.predicate = 'visibleFor' AND h.object = g.ActorId
        ) r
    ) a
    JOIN [rule].conditionActor ca ON ca.actorId = a.actorId -- only roles with rule assigned
    JOIN [rule].condition c ON ca.conditionId = c.conditionId
    JOIN [rule].conditionItem ci ON ci.conditionId = ca.conditionId
    JOIN [rule].conditionProperty cp ON cp.conditionId = ci.conditionId
    JOIN [rule].limit l ON l.conditionId = cp.conditionId
    JOIN [user].[role] ur ON ca.actorId = ur.actorId AND ur.isEnabled = 1
    WHERE ci.itemNameId = @operationId
        AND l.currency = @currency
        AND cp.factor = 'co'
        AND ca.factor = 'co'
        AND cp.[name] = @property -- only roles with specified property
        AND c.isDeleted = 0

    ---- get user role and max approval amount
    SELECT TOP 1
        @roleId = t.actorId,
        @nextLevelRoleId = t2.actorId
    FROM #temp t
    CROSS APPLY
    (
        SELECT r.actorId -- roles assigned to user
        FROM core.actorGraph(@userId, 'memberOf', 'subject') g
        CROSS APPLY core.actorGraph(g.actorId, 'role', 'subject') r
        WHERE t.actorId = r.actorId
    ) h
    LEFT JOIN #temp t2 ON t2.minAmount = t.maxAmount AND t.approvalLevel <> t2.approvalLevel -- next role with higher limits than the user's
    ORDER BY t.minAmount DESC

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
        IF ISNULL(@approvedAmount, 0) = 0
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
            WHERE actorId = @nextLevelRoleId;
        END
        ELSE -- if approved amount <> 0, return role with minApprovalAmount = @approvedAmount, for reassignment
        BEGIN
            SET @nextLevelRoleId = (SELECT actorId FROM #temp t WHERE minAmount = @approvedAmount)

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
            WHERE minAmount = @approvedAmount;
        END;

        WITH users AS
        (
            SELECT
                p.actorId,
                p.firstName + ' ' + p.lastName AS fullName,
                b.level
            FROM
            (
                SELECT r.actorId -- users with next level role
                FROM core.actorGraph(@nextLevelRoleId, 'role', 'object') g
                CROSS APPLY core.actorGraph(g.actorId, 'memberof', 'object') r
            ) ah
            JOIN customer.person p ON p.actorId = ah.actorId
            JOIN core.actorHierarchy cah ON cah.subject = p.actorId AND cah.predicate = 'memberOf'
            JOIN core.actorGraph(@userId, 'memberOf', 'subject') b ON b.actorId = cah.object
        )

        --select only users from the nearest BU
        SELECT u.actorId, u.fullName
        FROM users u
        JOIN [user].[user] uu ON uu.actorId = u.actorId
        WHERE uu.isEnabled = 1
            AND u.level = (SELECT MIN(level) FROM users)

        DROP TABLE #temp

    END

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH
