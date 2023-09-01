import { app } from 'ut-portal/storybook';
import portal from './old';

export default {
    title: 'Rule'
};

const page = app({
    implementation: 'rule',
    utRule: true
}, {
    'core.translation.fetch': () => ({}),
    'rule.organization.graphFetch': () => ({
        organization: [{
            id: 1,
            title: 'Organization 1'
        }, {
            id: 2,
            title: 'Organization 2'
        }, {
            id: 1001,
            parents: 1,
            title: 'Business unit 1'
        }, {
            id: 1002,
            parents: 1,
            title: 'Business unit 2'
        }]
    }),
    'rule.item.fetch': () => ({ items: [] }),
    'rule.rule.fetch': () => ({
        condition: [],
        conditionActor: [],
        conditionItem: [],
        conditionProperty: [],
        splitName: [],
        splitRange: [],
        splitAssignment: [],
        limit: [],
        splitAnalytic: [],
        pagination: []
    }),
    'rule.rule.add': () => ({
        condition: [],
        conditionActor: [],
        conditionItem: [],
        conditionProperty: [],
        splitName: [],
        splitRange: [],
        splitAssignment: [],
        limit: [],
        splitAnalytic: [],
        pagination: []
    }),
    'rule.rule.addUnapproved': () => ({
        condition: [],
        conditionActor: [],
        conditionItem: [],
        conditionProperty: [],
        splitName: [],
        splitRange: [],
        splitAssignment: [],
        limit: [],
        splitAnalytic: []
    }),
    'rule.rule.fetchDeleted': () => ({
        condition: [],
        pagination: []
    })
}, [
    portal()
]);

export const RuleBrowse = page('rule.rule.browse');
export const RuleNew = page('rule.rule.new');
export const RuleOpen = page('rule.rule.open');
