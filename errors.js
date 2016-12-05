var create = require('ut-error').define;

var Rule = create('rule');
var Generic = create('generic', Rule);
var ExceedMinAmount = create('exceedMinLimitAmount', Rule);
var ExceedMaxAmount = create('exceedMaxLimitAmount', Rule);
var ExceedDailyLimitAmount = create('exceedDailyLimitAmount', Rule);
var ExceedDailyLimitCount = create('exceedDailyLimitCount', Rule);
var ExceedWeeklyLimitAmount = create('exceedWeeklyLimitAmount', Rule);
var ExceedWeeklyLimitCount = create('exceedWeeklyLimitCount', Rule);
var ExceedMonthlyLimitAmount = create('exceedMonthlyLimitAmount', Rule);
var ExceedMonthlyLimitCount = create('exceedMonthlyLimitCount', Rule);

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
    exceedMonthlyLimitCount: cause => new ExceedMonthlyLimitCount(cause)
};
