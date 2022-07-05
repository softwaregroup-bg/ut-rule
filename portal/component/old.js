// @ts-check
import route from './route';
import page from './page';
import reducer from './reducer';

import RuleBrowse from './rule.rule.browse';
import RuleNew from './rule.rule.new';
import RuleOpen from './rule.rule.open';

/** @type { import("../../handlers").handlerSet } */
export default function component() {
    route();
    return [
        () => ({ namespace: 'component/rule' }),
        page,
        reducer,
        RuleBrowse,
        RuleNew,
        RuleOpen
    ];
};
