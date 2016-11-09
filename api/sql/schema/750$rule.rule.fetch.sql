ALTER PROCEDURE [rule].[rule.fetch] (@conditionId INTEGER)
AS
BEGIN
	SELECT 'condition' AS resultSetName

	SELECT *
	FROM [rule].condition
	WHERE conditionId = @conditionId

	SELECT 'limit' AS resultSetName

	SELECT *
	FROM [rule].limit
	WHERE conditionId = @conditionId

	SELECT 'commission' AS resultSetName

	SELECT *
	FROM [rule].commission
	WHERE conditionId = @conditionId

	SELECT 'fee' AS resultSetName

	SELECT *
	FROM [rule].fee
	WHERE conditionId = @conditionId
END