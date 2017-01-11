ALTER PROCEDURE [rule].[rule.add]
    @condition [rule].conditionTT READONLY,
    @limit [rule].limitTT READONLY,
    @split XML
AS
DECLARE @splitName [rule].splitNameTT,
        @conditionId INT
BEGIN TRY

    BEGIN TRANSACTION

    INSERT INTO [rule].condition (
        [priority],
        channelCountryId,
        channelRegionId,
        channelCityId,
        channelOrganizationId,
        channelSupervisorId,
        channelTag,
        channelRoleId,
        channelId,
        operationId,
        operationTag,
        operationStartDate,
        operationEndDate,
        sourceCountryId,
        sourceRegionId,
        sourceCityId,
        sourceOrganizationId,
        sourceSupervisorId,
        sourceTag,
        sourceId,
        sourceCardProductId,
        sourceAccountProductId,
        sourceAccountId,
        destinationCountryId,
        destinationRegionId,
        destinationCityId,
        destinationOrganizationId,
        destinationSupervisorId,
        destinationTag,
        destinationId,
        destinationAccountProductId,
        destinationAccountId
        )
    SELECT [priority],
        [channelCountryId],
        [channelRegionId],
        [channelCityId],
        [channelOrganizationId],
        [channelSupervisorId],
        [channelTag],
        [channelRoleId],
        [channelId],
        [operationId],
        [operationTag],
        [operationStartDate],
        [operationEndDate],
        [sourceCountryId],
        [sourceRegionId],
        [sourceCityId],
        [sourceOrganizationId],
        [sourceSupervisorId],
        [sourceTag],
        [sourceId],
        [sourceCardProductId],
        [sourceAccountProductId],
        [sourceAccountId],
        [destinationCountryId],
        [destinationRegionId],
        [destinationCityId],
        [destinationOrganizationId],
        [destinationSupervisorId],
        [destinationTag],
        [destinationId],
        [destinationAccountProductId],
        [destinationAccountId]
    FROM @condition;

    SET @conditionId = SCOPE_IDENTITY()

    INSERT INTO [rule].limit (
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
    SELECT @conditionId,
        [currency],
        [minAmount],
        [maxAmount],
        [maxAmountDaily],
        [maxCountDaily],
        [maxAmountWeekly],
        [maxCountWeekly],
        [maxAmountMonthly],
        [maxCountMonthly]
    FROM @limit;

    MERGE INTO [rule].splitName
    USING @split.nodes('/*/*/splitName') AS records(r)
    ON 1 = 0
    WHEN NOT MATCHED THEN
      INSERT (conditionId, name) VALUES (@conditionId, r.value('(name)[1]', 'nvarchar(50)'))
    OUTPUT INSERTED.* INTO @splitName;

    MERGE INTO [rule].splitRange
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
    ON 1 = 0
    WHEN NOT MATCHED THEN
      INSERT (splitNameId, startAmount, startAmountCurrency, isSourceAmount, minValue, maxValue, [percent], percentBase)
      VALUES (r.splitNameId, r.startAmount, r.startAmountCurrency, r.isSourceAmount, r.minValue, r.maxValue, r.[percent], r.percentBase);

    MERGE INTO [rule].splitAssignment
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
    ON 1 = 0
    WHEN NOT MATCHED THEN
      INSERT (splitNameId, debit, credit, minValue, maxValue, [percent], description)
      VALUES (r.splitNameId, r.debit, r.credit, r.minValue, r.maxValue, r.[percent], r.description);

    COMMIT TRANSACTION

    EXEC [rule].[rule.fetch] @conditionId = @conditionId
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH