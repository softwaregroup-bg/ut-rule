var create = require('ut-error').define;

var Rule = create('rule');
var Generic = create('generic', Rule);
var ExceedMinAmount = create('exceedMinLimitAmount', Rule, 'You have reached your minimum Transaction limit');
var ExceedMaxAmount = create('exceedMaxLimitAmount', Rule, 'You have reached your maximum Transaction limit');
var ExceedDailyLimitAmount = create('exceedDailyLimitAmount', Rule, 'Daily amount limit reached');
var ExceedDailyLimitCount = create('exceedDailyLimitCount', Rule, 'Daily count limit reached');
var ExceedWeeklyLimitAmount = create('exceedWeeklyLimitAmount', Rule, 'Weekly amount limit reached');
var ExceedWeeklyLimitCount = create('exceedWeeklyLimitCount', Rule, 'Weekly count limit reached');
var ExceedMonthlyLimitAmount = create('exceedMonthlyLimitAmount', Rule, 'Monthly amount limit reached');
var ExceedMonthlyLimitCount = create('exceedMonthlyLimitCount', Rule, 'Monthly count limit reached');
var DuplicatedPriority = create('duplicatedPriority', Rule, 'Rule with this priority already exists');
var ExceedSourceAccountMinBalance = create('exceedSourceAccountMinBalance', Rule, 'Source account min balance violation');
var ExceedSourceAccountMaxBalance = create('exceedSourceAccountMaxBalance', Rule, 'Source account max balance violation');
var ExceedDestinationAccountMinBalance = create('exceedDestinationAccountMinBalance', Rule, 'Destination account min balance violation');
var ExceedDestinationAccountMaxBalance = create('exceedDestinationAccountMaxBalance', Rule, 'Destination account max balance violation');

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
    exceedSourceAccountMinBalance: cause => new ExceedSourceAccountMinBalance(cause),
    exceedSourceAccountMaxBalance: cause => new ExceedSourceAccountMaxBalance(cause),
    exceedDestinationAccountMinBalance: cause => new ExceedDestinationAccountMinBalance(cause),
    exceedDestinationAccountMaxBalance: cause => new ExceedDestinationAccountMaxBalance(cause),
};
