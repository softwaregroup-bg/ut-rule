
module.exports = (create) => {
    const Rule = create('rule');
    return {
        rule: cause => new Rule(cause),
        generic: create('generic', Rule),
        ruleNotExists: create('ruleNotExists', Rule, 'Rule does not exists'),
        exceedMaxLimitAmount: create('exceedMaxLimitAmount', Rule, 'Transaction amount is above maximum'),
        exceedMinLimitAmount: create('exceedMinLimitAmount', Rule, 'Transaction amount is below minimum'),
        reachedDailyLimitAmount: create('reachedDailyLimitAmount', Rule, 'Daily amount limit reached'),
        reachedWeeklyLimitAmount: create('reachedWeeklyLimitAmount', Rule, 'Weekly amount limit reached'),
        reachedMonthlyLimitAmount: create('reachedMonthlyLimitAmount', Rule, 'Monthly amount limit reached'),
        exceedDailyLimitAmount: create('exceedDailyLimitAmount', Rule, 'Daily amount limit exceeded'),
        exceedWeeklyLimitAmount: create('exceedWeeklyLimitAmount', Rule, 'Weekly amount limit exceeded'),
        exceedMonthlyLimitAmount: create('exceedMonthlyLimitAmount', Rule, 'Monthly amount limit exceeded'),
        exceedDailyLimitCount: create('exceedDailyLimitCount', Rule, 'Daily count limit reached'),
        exceedWeeklyLimitCount: create('exceedWeeklyLimitCount', Rule, 'Weekly count limit reached'),
        exceedMonthlyLimitCount: create('exceedMonthlyLimitCount', Rule, 'Monthly count limit reached'),
        duplicatedPriority: create('duplicatedPriority', Rule, 'Rule with this priority already exists'),
        unauthorizedMinLimitAmount: create('unauthorizedMinLimitAmount', Rule, 'Transaction amount below minimum unauthorized'),
        unauthorizedMaxLimitAmount: create('unauthorizedMaxLimitAmount', Rule, 'Transaction amount above maximum unauthorized'),
        unauthorizedDailyLimitAmount: create('unauthorizedDailyLimitAmount', Rule, 'Daily amount limit unauthorized'),
        unauthorizedDailyLimitCount: create('unauthorizedDailyLimitCount', Rule, 'Daily count limit unauthorized'),
        unauthorizedWeeklyLimitAmount: create('unauthorizedWeeklyLimitAmount', Rule, 'Weekly amount limit unauthorized'),
        unauthorizedWeeklyLimitCount: create('unauthorizedWeeklyLimitCount', Rule, 'Weekly count limit unauthorized'),
        unauthorizedMonthlyLimitAmount: create('unauthorizedMonthlyLimitAmount', Rule, 'Monthly amount limit unauthorized'),
        unauthorizedMonthlyLimitCount: create('unauthorizedMonthlyLimitCount', Rule, 'Monthly count limit unauthorized')
    };
};
