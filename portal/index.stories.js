import { app } from 'ut-portal/storybook';
import customer from 'ut-customer/portal';
import customerDropdown from 'ut-customer/model/dropdown';
import coreDropdown from 'ut-core/model/dropdown';
import history from 'ut-history/portal';

import rule from './';
import ruleMock from './mock';
import ruleDropdown from '../model/dropdown';

export default {
    title: 'Rule'
};

const page = app({
    implementation: 'rule',
    utHistory: true,
    utCustomer: true,
    utRule: true
}, {
    ...ruleDropdown,
    ...customerDropdown,
    ...coreDropdown
}, [
    history(),
    customer(),
    rule(),
    ruleMock()
]);

export const ConditionBrowse = page('rule.condition.browse');
export const ConditionNew = page('rule.condition.new');
export const ConditionOpen = page('rule.condition.open', 1000);
export const ConditionOpen1 = page('rule.condition.open', 1001);
