--for checking if Rule creation/editing needs approval or not
MERGE INTO [core].[configuration] AS target
USING
(VALUES
    ('DisableRuleM/C', '0', 'Rule Checker approval')
) AS source ([key], [value], [description])
ON target.[key] = source.[key]
WHEN MATCHED THEN
    UPDATE SET target.[value] = source.[value]
WHEN NOT MATCHED BY target THEN
    INSERT ([key], [value], [description])
    VALUES ([key], [value], [description]);
