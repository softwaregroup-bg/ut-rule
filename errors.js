const create = require('ut-error').define;
const Rule = create('rule');

module.exports = {
    rule: cause => new Rule(cause),
    generic: create('generic', Rule),
    exceedMinAmount: create('exceedMinLimitAmount', Rule, 'Transaction amount is below minimum'),
    exceedMaxAmount: create('exceedMaxLimitAmount', Rule, 'Transaction amount is above maximum'),
    exceedDailyLimitAmount: create('exceedDailyLimitAmount', Rule, 'Daily amount limit exceeded'),
    exceedDailyLimitAmountReached: create('exceedDailyLimitAmountReached', Rule, 'Daily amount limit reached'),
    exceedDailyLimitCount: create('exceedDailyLimitCount', Rule, 'Daily count limit reached'),
    exceedWeeklyLimitAmount: create('exceedWeeklyLimitAmount', Rule, 'Weekly amount limit exceeded'),
    exceedWeeklyLimitAmountReached: create('exceedWeeklyLimitAmountReached', Rule, 'Weekly amount limit reached'),
    exceedWeeklyLimitCount: create('exceedWeeklyLimitCount', Rule, 'Weekly count limit reached'),
    exceedMonthlyLimitAmount: create('exceedMonthlyLimitAmount', Rule, 'Monthly amount limit exceeded'),
    exceedMonthlyLimitAmountReached: create('exceedMonthlyLimitAmountReached', Rule, 'Monthly amount limit reached'),
    exceedMonthlyLimitCount: create('exceedMonthlyLimitCount', Rule, 'Monthly count limit reached'),
    duplicatedPriority: create('duplicatedPriority', Rule, 'Rule with this priority already exists'),
    unauthorizedMinAmount: create('unauthorizedMinLimitAmount', Rule, 'Transaction amount below minimum unauthorized'),
    unauthorizedMaxAmount: create('unauthorizedMaxLimitAmount', Rule, 'Transaction amount above maximum unauthorized'),
    unauthorizedDailyLimitAmount: create('unauthorizedDailyLimitAmount', Rule, 'Daily amount limit unauthorized'),
    unauthorizedDailyLimitCount: create('unauthorizedDailyLimitCount', Rule, 'Daily count limit unauthorized'),
    unauthorizedWeeklyLimitAmount: create('unauthorizedWeeklyLimitAmount', Rule, 'Weekly amount limit unauthorized'),
    unauthorizedWeeklyLimitCount: create('unauthorizedWeeklyLimitCount', Rule, 'Weekly count limit unauthorized'),
    unauthorizedMonthlyLimitAmount: create('unauthorizedMonthlyLimitAmount', Rule, 'Monthly amount limit unauthorized'),
    unauthorizedMonthlyLimitCount: create('unauthorizedMonthlyLimitCount', Rule, 'Monthly count limit unauthorized')
};
