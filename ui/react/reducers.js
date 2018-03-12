import uiConfig from './configuration/reducers';
import ruleList from './pages/Rules/reducer';
import { ruleProfileReducer } from './pages/RuleProfile/reducer';

export default {
    ...uiConfig,
    ruleList,
    ruleProfileReducer
};
