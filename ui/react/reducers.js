import uiConfig from './configuration/reducers';
import main from './pages/Rules/reducer';
import { ruleProfileReducer } from './pages/RuleProfile/reducer';

export default {
    ...uiConfig,
    main,
    ruleProfileReducer
};
