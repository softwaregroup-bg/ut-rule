ALTER PROCEDURE [rule].[rule.edit]
    @condition [rule].conditionTT READONLY,
    @limit [rule].limitTT READONLY,
    @split XML
AS
DECLARE @splitName [rule].splitNameTT,
        @conditionId INT
BEGIN TRY
    BEGIN TRANSACTION
    SET @conditionId = (SELECT conditionId FROM @condition)

    DELETE
        l
    FROM
        [rule].limit l
    LEFT JOIN
        @limit l1 ON l.limitId = l1.limitId
    WHERE
        l.conditionId = @conditionId
        AND l1.limitId IS NULL

    DELETE
        x
    FROM
        [rule].splitRange x
    LEFT JOIN
        @split.nodes('/*/*/splitRange') AS records(x) ON x.splitRangeId = records.x.value('(splitRangeId)[1]', 'int')
    JOIN
        [rule].splitName sn ON x.splitNameId = sn.splitNameId
    WHERE
        sn.conditionId = @conditionId AND records.x.value('(splitRangeId)[1]', 'int') IS NULL

    DELETE
        x
    FROM
        [rule].splitAssignment x
    LEFT JOIN
        @split.nodes('/*/*/splitAssignment') AS records(x) ON x.splitAssignmentId = records.x.value('(splitAssignmentId)[1]', 'int')
    JOIN
        [rule].splitName sn ON x.splitNameId = sn.splitNameId
    WHERE
        sn.conditionId = @conditionId AND records.x.value('(splitAssignmentId)[1]', 'int') IS NULL

    DELETE
        x
    FROM
        [rule].splitName x
    LEFT JOIN
        @split.nodes('/*/*/splitName') AS records(x) ON x.splitNameId = records.x.value('(splitNameId)[1]', 'int')
    WHERE
        x.conditionId = @conditionId AND records.x.value('(splitNameId)[1]', 'int') IS NULL

    UPDATE
        c
    SET
        [priority] = c1.[priority],
        channelCountryId = c1.channelCountryId,
        channelRegionId = c1.channelRegionId,
        channelCityId = c1.channelCityId,
        channelOrganizationId = c1.channelOrganizationId,
        channelSupervisorId = c1.channelSupervisorId,
        channelTag = c1.channelTag,
        channelRoleId = c1.channelRoleId,
        channelId = c1.channelId,
        operationId = c1.operationId,
        operationTag = c1.operationTag,
        operationStartDate = c1.operationStartDate,
        operationEndDate = c1.operationEndDate,
        sourceCountryId = c1.sourceCountryId,
        sourceRegionId = c1.sourceRegionId,
        sourceCityId = c1.sourceCityId,
        sourceOrganizationId = c1.sourceOrganizationId,
        sourceSupervisorId = c1.sourceSupervisorId,
        sourceTag = c1.sourceTag,
        sourceId = c1.sourceId,
        sourceCardProductId = c1.sourceCardProductId,
        sourceAccountProductId = c1.sourceAccountProductId,
        sourceAccountId = c1.sourceAccountId,
        destinationCountryId = c1.destinationCountryId,
        destinationRegionId = c1.destinationRegionId,
        destinationCityId = c1.destinationCityId,
        destinationOrganizationId = c1.destinationOrganizationId,
        destinationSupervisorId = c1.destinationSupervisorId,
        destinationTag = c1.destinationTag,
        destinationId = c1.destinationId,
        destinationAccountProductId = c1.destinationAccountProductId,
        destinationAccountId = c1.destinationAccountId
    FROM
        [rule].condition c
    JOIN
        @condition c1 ON c.conditionId = c1.conditionId

    MERGE INTO [rule].splitName x
    USING @split.nodes('/*/*/splitName') AS records(r)
    ON x.splitNameId = records.r.value('(splitNameId)[1]', 'int')
    WHEN NOT MATCHED THEN
      INSERT (
          conditionId,
          name,
          tag
      ) VALUES (
          @conditionId,
          records.r.value('(name)[1]', 'nvarchar(50)'),
          records.r.value('(tag)[1]', 'nvarchar(max)')
      )
    WHEN MATCHED THEN
      UPDATE SET
        name = records.r.value('(name)[1]', 'nvarchar(50)'),
        tag = records.r.value('(tag)[1]', 'nvarchar(max)')
    OUTPUT INSERTED.* INTO @splitName;

    MERGE INTO [rule].splitRange x
    USING (
      SELECT
          sn.splitNameId AS splitNameId,
          splitRange.x.query('*').value('(startAmount)[1]', 'money') AS startAmount,
          splitRange.x.query('*').value('(startAmountCurrency)[1]', 'varchar(3)') AS startAmountCurrency,
          ISNULL(splitRange.x.query('*').value('(isSourceAmount)[1]', 'bit'), 1) AS isSourceAmount,
          splitRange.x.query('*').value('(minValue)[1]', 'money') AS minValue,
          splitRange.x.query('*').value('(maxValue)[1]', 'money') AS maxValue,
          splitRange.x.query('*').value('(percent)[1]', 'money') AS [percent],
          splitRange.x.query('*').value('(percentBase)[1]', 'money') AS percentBase
      FROM
          @split.nodes('/*/*') AS records(x)
      CROSS APPLY
          records.x.nodes('splitRange') AS splitRange(x)
      JOIN
          @splitName sn
      ON
          records.x.value('(splitName/name)[1]', 'nvarchar(50)') = sn.name
    ) AS r
    ON x.splitNameId = r.splitNameId
    WHEN NOT MATCHED THEN
      INSERT (splitNameId, startAmount, startAmountCurrency, isSourceAmount, minValue, maxValue, [percent], percentBase)
      VALUES (r.splitNameId, r.startAmount, r.startAmountCurrency, r.isSourceAmount, r.minValue, r.maxValue, r.[percent], r.percentBase)
    WHEN MATCHED THEN
        UPDATE SET
            startAmount = r.startAmount,
            startAmountCurrency = r.startAmountCurrency,
            isSourceAmount = r.isSourceAmount,
            minValue = r.minValue,
            maxValue = r.maxValue,
            [percent] = r.[percent],
            percentBase = r.percentBase;

    MERGE INTO [rule].splitAssignment x
    USING (
      SELECT
          sn.splitNameId AS splitNameId,
          splitAssignment.x.query('*').value('(debit)[1]', 'varchar(50)') AS debit,
          splitAssignment.x.query('*').value('(credit)[1]', 'varchar(50)') AS credit,
          splitAssignment.x.query('*').value('(minValue)[1]', 'money') AS minValue,
          splitAssignment.x.query('*').value('(maxValue)[1]', 'money') AS maxValue,
          splitAssignment.x.query('*').value('(percent)[1]', 'decimal') AS [percent],
          splitAssignment.x.query('*').value('(description)[1]', 'varchar(50)') AS description
      FROM
          @split.nodes('/*/*') AS records(x)
      CROSS APPLY
          records.x.nodes('splitAssignment') AS splitAssignment(x)
      JOIN
          @splitName sn
      ON
          records.x.value('(splitName/name)[1]', 'nvarchar(50)') = sn.name
    ) AS r
    ON x.splitNameId = r.splitNameId
    WHEN NOT MATCHED THEN
      INSERT (splitNameId, debit, credit, minValue, maxValue, [percent], description)
      VALUES (r.splitNameId, r.debit, r.credit, r.minValue, r.maxValue, r.[percent], r.description)
    WHEN MATCHED THEN
      UPDATE SET
          debit = r.debit,
          credit = r.credit,
          minValue = r.minValue,
          maxValue = r.maxValue,
          [percent] = r.[percent],
          description = r.description;

    UPDATE
        l
    SET
        currency = l1.currency,
        minAmount = l1.minAmount,
        maxAmount = l1.maxAmount,
        maxAmountDaily = l1.maxAmountDaily,
        maxCountDaily = l1.maxCountDaily,
        maxAmountWeekly = l1.maxAmountWeekly,
        maxCountWeekly = l1.maxCountWeekly,
        maxAmountMonthly = l1.maxAmountMonthly,
        maxCountMonthly = l1.maxCountMonthly
    FROM
        [rule].limit l
    JOIN
        @limit l1 ON l.limitId = l1.limitId

    INSERT INTO
        [rule].limit (
            conditionId,
            currency,
            minAmount,
            maxAmount,
            maxAmountDaily,
            maxCountDaily,
            maxAmountWeekly,
            maxCountWeekly,
            maxAmountMonthly,
            maxCountMonthly
        )
    SELECT
        l1.conditionId,
        l1.currency,
        l1.minAmount,
        l1.maxAmount,
        l1.maxAmountDaily,
        l1.maxCountDaily,
        l1.maxAmountWeekly,
        l1.maxCountWeekly,
        l1.maxAmountMonthly,
        l1.maxCountMonthly
    FROM
        @limit l1
    LEFT JOIN
        [rule].limit l ON l.limitId = l1.limitId
    WHERE
        l.limitId IS NULL


    COMMIT TRANSACTION

    EXEC [rule].[rule.fetch] @conditionId = @conditionId
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH