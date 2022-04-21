
module.exports = function error({utError: {defineError, getError, fetchErrors}}) {
    if (!getError('rule')) {
        const Rule = defineError('rule', null, 'ut-rule rule error', 'error');

        defineError('generic', Rule, 'Rule generic');
        defineError('amount', Rule, 'Invalid amounts');
        defineError('ruleNotExists', Rule, 'Rule does not exists');
        defineError('exceedMaxLimitAmount', Rule, 'Transaction amount is above maximum');
        defineError('exceedMinLimitAmount', Rule, 'Transaction amount is below minimum');
        defineError('reachedDailyLimitAmount', Rule, 'Daily amount limit reached');
        defineError('reachedWeeklyLimitAmount', Rule, 'Weekly amount limit reached');
        defineError('reachedMonthlyLimitAmount', Rule, 'Monthly amount limit reached');
        defineError('exceedDailyLimitAmount', Rule, 'Daily amount limit exceeded');
        defineError('exceedWeeklyLimitAmount', Rule, 'Weekly amount limit exceeded');
        defineError('exceedMonthlyLimitAmount', Rule, 'Monthly amount limit exceeded');
        defineError('exceedDailyLimitCount', Rule, 'Daily count limit reached');
        defineError('exceedWeeklyLimitCount', Rule, 'Weekly count limit reached');
        defineError('exceedMonthlyLimitCount', Rule, 'Monthly count limit reached');
        defineError('duplicatedPriority', Rule, 'Rule with this priority already exists');
        defineError('securityViolation', Rule, 'Unauthorized operation');
        defineError('unauthorizedMinLimitAmount', Rule, 'Transaction amount below minimum unauthorized');
        defineError('unauthorizedMaxLimitAmount', Rule, 'Transaction amount above maximum unauthorized');
        defineError('unauthorizedDailyLimitAmount', Rule, 'Daily amount limit unauthorized');
        defineError('unauthorizedDailyLimitCount', Rule, 'Daily count limit unauthorized');
        defineError('unauthorizedWeeklyLimitAmount', Rule, 'Weekly amount limit unauthorized');
        defineError('unauthorizedWeeklyLimitCount', Rule, 'Weekly count limit unauthorized');
        defineError('unauthorizedMonthlyLimitAmount', Rule, 'Monthly amount limit unauthorized');
        defineError('unauthorizedMonthlyLimitCount', Rule, 'Monthly count limit unauthorized');
    }

    return fetchErrors('rule');
};
