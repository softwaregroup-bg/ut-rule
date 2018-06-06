IF NOT EXISTS (
  SELECT * 
  FROM sys.columns 
  WHERE OBJECT_ID = OBJECT_ID('[rule].[condition]') 
    AND [NAME] = 'channelType'
)
  ALTER TABLE [rule].[condition] ADD channelType NVARCHAR(100)
