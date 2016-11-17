ALTER PROCEDURE [rule].[rule.fetch]
	@conditionId INT
AS
BEGIN
	SELECT 'condition' AS resultSetName

	SELECT *
	FROM [rule].condition
	WHERE @conditionId IS NULL OR conditionId = @conditionId

	SELECT 'limit' AS resultSetName

	SELECT *
	FROM [rule].limit
	WHERE @conditionId IS NULL OR conditionId = @conditionId

	SELECT 'commission' AS resultSetName

	SELECT *
	FROM [rule].commission
	WHERE @conditionId IS NULL OR conditionId = @conditionId

	SELECT 'fee' AS resultSetName

	SELECT *
	FROM [rule].fee
	WHERE @conditionId IS NULL OR conditionId = @conditionId
END