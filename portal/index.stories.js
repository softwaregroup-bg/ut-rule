import { app } from 'ut-portal/storybook';
import customerDropdown from 'ut-customer/model/dropdown';
import coreDropdown from 'ut-core/model/dropdown';

import rule from './';
import ruleMock from './mock';
import ruleDropdown from '../model/dropdown';

export default {
    title: 'Rule'
};

const page = app({
    implementation: 'rule',
    utRule: true
}, {
    ...ruleDropdown,
    ...customerDropdown,
    ...coreDropdown
}, [
    rule(),
    ruleMock()
]);

export const ConditionBrowse = page('rule.condition.browse');
export const ConditionNew = page('rule.condition.new');
export const ConditionOpen = page('rule.condition.open', 1001);
