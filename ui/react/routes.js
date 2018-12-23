import { Rules, RuleCreate, RuleEdit } from './pages';
import React from 'react';
import {
    Route,
    Switch
} from 'react-router';
import {
    getLink
} from 'ut-front-react/routerHelper';
import registerRoutes from './registerRoutes';
import {
    hot
} from 'react-hot-loader';

registerRoutes();

export default hot(module)(() =>
    <Switch>
        <Route exact path={getLink('ut-rule:rules')} component={Rules} />
        <Route exact path={getLink('ut-rule:create')} component={RuleCreate} />
        <Route exact path={getLink('ut-rule:edit')} component={RuleEdit} />
    </Switch>
);
