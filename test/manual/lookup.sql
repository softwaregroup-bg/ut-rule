DECLARE @tp [rule].[properties]
DECLARE @meta core.metaDataTT
INSERT INTO @meta([auth.actorId], [globalId], method, [auth.sessionId]) VALUES (1000, '795b2bbe-56d0-446b-94bf-a1fd4bbfa338', 'rule.decision.lookup', 'test3')
EXEC [rule].[decision.lookup]
    @channelId = 1,
    @operation = 'Buy/Sell Currency',
    @operationDate = '2023-09-19',
    @sourceAccount = '',
    @sourceCardProductId = NULL,
    @destinationAccount = '',
    @amount = 1,
    @settlementAmount = NULL,
    @accountAmount = NULL,
    @currency = 'USD',
    @settlementCurrency = 'USD',
    @accountCurrency = 'IQD',
    @isSourceAmount = NULL,
    @sourceAccountOwnerId = NULL,
    @destinationAccountOwnerId = NULL,
    @credentials = NULL,
    @timeDifference = NULL,
    @isTransactionValidate = NULL,
    @transferProperties = @tp,
    @meta = @meta
