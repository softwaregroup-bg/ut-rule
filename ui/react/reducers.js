import uiConfig from './configuration/reducers';
import main from './pages/Main/reducer';
import { ruleRewriteReducer } from './pages/Rewrite/reducer';
import { ruleTabReducer } from './containers/Tabs/Index/reducer';
import { ruleChannelTabReducer } from './containers/Tabs/Channel/reducer';
import { ruleSourceTabReducer } from './containers/Tabs/Source/reducer';
import { ruleOperationTabReducer } from './containers/Tabs/Operation/reducer';
import { ruleDestinationTabReducer } from './containers/Tabs/Destination/reducer';
import { ruleSplitTabReducer } from './containers/Tabs/Split/reducer';
import { ruleLimitTabReducer } from './containers/Tabs/Limit/reducer';

export default {
    ...uiConfig,
    main,
    ruleRewriteReducer,
    ruleTabReducer,
    ruleChannelTabReducer,
    ruleSourceTabReducer,
    ruleOperationTabReducer,
    ruleDestinationTabReducer,
    ruleSplitTabReducer,
    ruleLimitTabReducer
};
