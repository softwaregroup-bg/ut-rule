var create = require('ut-error').define;

var Rule = create('rule');
var Generic = create('generic', Rule);
var ExceedMinAmount = create('exceedMinLimitAmount', Rule, 'Transaction amount is below minimum');
var ExceedMaxAmount = create('exceedMaxLimitAmount', Rule, 'Transaction amount is above maximum');
var ExceedDailyLimitAmount = create('exceedDailyLimitAmount', Rule, 'Daily amount limit reached');
var ExceedDailyLimitCount = create('exceedDailyLimitCount', Rule, 'Daily count limit reached');
var ExceedWeeklyLimitAmount = create('exceedWeeklyLimitAmount', Rule, 'Weekly amount limit reached');
var ExceedWeeklyLimitCount = create('exceedWeeklyLimitCount', Rule, 'Weekly count limit reached');
var ExceedMonthlyLimitAmount = create('exceedMonthlyLimitAmount', Rule, 'Monthly amount limit reached');
var ExceedMonthlyLimitCount = create('exceedMonthlyLimitCount', Rule, 'Monthly count limit reached');
var DuplicatedPriority = create('duplicatedPriority', Rule, 'Rule with this priority already exists');
var AuthenticationFailure = create('authenticationFailure', Rule, 'Authentication Failure');

module.exports = {
    rule: cause => new Rule(cause),
    generic: cause => new Generic(cause),
    exceedMinAmount: cause => new ExceedMinAmount(cause),
    exceedMaxAmount: cause => new ExceedMaxAmount(cause),
    exceedDailyLimitAmount: cause => new ExceedDailyLimitAmount(cause),
    exceedDailyLimitCount: cause => new ExceedDailyLimitCount(cause),
    exceedWeeklyLimitAmount: cause => new ExceedWeeklyLimitAmount(cause),
    exceedWeeklyLimitCount: cause => new ExceedWeeklyLimitCount(cause),
    exceedMonthlyLimitAmount: cause => new ExceedMonthlyLimitAmount(cause),
    exceedMonthlyLimitCount: cause => new ExceedMonthlyLimitCount(cause),
    duplicatedPriority: cause => new DuplicatedPriority(cause),
    authenticationFailure: cause => new AuthenticationFailure(cause)
};
