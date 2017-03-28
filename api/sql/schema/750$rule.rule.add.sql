ALTER PROCEDURE [rule].[rule.add]
    @condition [rule].conditionTT READONLY,
    @conditionActor [rule].conditionActorTT READONLY,
    @conditionItem [rule].conditionItemTT READONLY,
    @conditionProperty [rule].conditionPropertyTT READONLY,
    @limit [rule].limitTT READONLY,
    @split XML
AS
DECLARE @splitName		   [rule].splitNameTT,
	   @splitAssignment	   [rule].splitAssignmentTT,
        @conditionId	   INT
BEGIN TRY

    BEGIN TRANSACTION

    INSERT INTO [rule].condition (
            [priority],
            operationStartDate,
            operationEndDate,
            sourceAccountId,
            destinationAccountId
        )
    SELECT
        [priority],
        operationStartDate,
        operationEndDate,
        sourceAccountId,
        destinationAccountId
    FROM @condition;

    SET @conditionId = SCOPE_IDENTITY()

    INSERT INTO [rule].conditionActor 
    (
        conditionId,
        factor,
        actorId
    )
    SELECT
        @conditionId, 
        factor,
        actorId
    FROM @conditionActor

    INSERT INTO [rule].conditionItem 
    (
        conditionId,
        factor,
        itemNameId
    )
    SELECT
        @conditionId,
        factor,
        itemNameId
    FROM @conditionItem

    INSERT INTO [rule].[conditionProperty] 
    (
        conditionId,
        factor,
        name,
        value
    )
    SELECT
        @conditionId,
        factor,
        name,
        value    
    FROM @conditionProperty

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
    FROM @limit

    MERGE INTO [rule].splitName
    USING @split.nodes('/*/*/splitName') AS records(r)
    ON 1 = 0
    WHEN NOT MATCHED THEN
      INSERT (conditionId, name, tag) VALUES (@conditionId, r.value('(name)[1]', 'nvarchar(50)'), r.value('(tag)[1]', 'nvarchar(max)'))
    OUTPUT INSERTED.* INTO @splitName;

    MERGE INTO [rule].splitRange
    USING (
      SELECT
          sn.splitNameId AS splitNameId,
          splitRange.x.query('*').value('(startAmount)[1]', 'money') AS startAmount,
          splitRange.x.query('*').value('(startAmountCurrency)[1]', 'varchar(3)') AS startAmountCurrency,
          ISNULL(splitRange.x.value('(./startAmountDaily/text())[1]', 'money'), 0) AS startAmountDaily,
          ISNULL(splitRange.x.value('(./startCountDaily/text())[1]', 'bigint'), 0) AS startCountDaily,
          ISNULL(splitRange.x.value('(./startAmountWeekly/text())[1]', 'money'), 0) AS startAmountWeekly,
          ISNULL(splitRange.x.value('(./startCountWeekly/text())[1]', 'bigint'), 0) AS startCountWeekly,
          ISNULL(splitRange.x.value('(./startAmountMonthly/text())[1]', 'money'), 0) AS startAmountMonthly,
          ISNULL(splitRange.x.value('(./startCountMonthly/text())[1]', 'bigint'), 0) AS startCountMonthly,
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
      INSERT (
          splitNameId,
          startAmount,
          startAmountCurrency,
          startAmountDaily,
          startCountDaily,
          startAmountWeekly,
          startCountWeekly,
          startAmountMonthly,
          startCountMonthly,
          isSourceAmount,
          minValue,
          maxValue,
          [percent],
          percentBase)
      VALUES (
          r.splitNameId,
          r.startAmount,
          r.startAmountCurrency,
          r.startAmountDaily,
          r.startCountDaily,
          r.startAmountWeekly,
          r.startCountWeekly,
          r.startAmountMonthly,
          r.startCountMonthly,
          r.isSourceAmount,
          r.minValue,
          r.maxValue,
          r.[percent],
          r.percentBase);

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
      VALUES (r.splitNameId, r.debit, r.credit, r.minValue, r.maxValue, r.[percent], r.description)
    OUTPUT INSERTED.* INTO @splitAssignment;


    MERGE INTO [rule].splitAnalytic
    USING (
	 SELECT
          sn.splitAssignmentId AS splitAssignmentId,
		splitAssignment.x.query('*').value('(name)[1]', 'nvarchar(50)')		AS [name],
          splitAssignment.x.query('*').value('(value)[1]', 'nvarchar(150)')	AS [value]
      FROM
          @split.nodes('/*/*') AS records(x)
      CROSS APPLY
          records.x.nodes('*/splitAnalytic') AS splitAssignment(x)
      LEFT JOIN @splitAssignment sn ON	 records.x.value('(splitAssignment/debit)[1]', 'nvarchar(50)')	   = sn.debit
									AND records.x.value('(splitAssignment/credit)[1]', 'nvarchar(50)')	   = sn.credit
									AND records.x.value('(splitAssignment/description)[1]', 'nvarchar(50)') = sn.[description]
    ) AS r (splitAssignmentId, [name], [value])
    ON 1 = 0
    WHEN NOT MATCHED THEN
      INSERT (splitAssignmentId, [name], [value])
      VALUES (r.splitAssignmentId, r.[name], r.[value])
--    OUTPUT INSERTED.*
    ;

    COMMIT TRANSACTION

    EXEC [rule].[rule.fetch] @conditionId = @conditionId
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH