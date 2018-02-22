import uiConfig from './configuration/reducers';
import main from './pages/Rules/reducer';
import { ruleProfileReducer } from './pages/RuleProfile/reducer';
import { ruleChannelTabReducer } from './pages/RuleProfile/Tabs/Channel/reducer';
import { ruleSourceTabReducer } from './pages/RuleProfile/Tabs/Source/reducer';
import { ruleOperationTabReducer } from './pages/RuleProfile/Tabs/Operation/reducer';
import { ruleDestinationTabReducer } from './pages/RuleProfile/Tabs/Destination/reducer';
import { ruleSplitTabReducer } from './pages/RuleProfile/Tabs/Split/reducer';
import { ruleLimitTabReducer } from './pages/RuleProfile/Tabs/Limit/reducer';

export default {
    ...uiConfig,
    main,
    ruleTabReducer: ruleProfileReducer, // todo rename
    ruleChannelTabReducer,
    ruleSourceTabReducer,
    ruleOperationTabReducer,
    ruleDestinationTabReducer,
    ruleSplitTabReducer,
    ruleLimitTabReducer
};
