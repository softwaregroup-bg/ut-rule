import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { Rules, RuleCreate, RuleEdit } from './pages';
import { getRoute } from 'ut-front-react/routerHelper';
import registerRoutes from './registerRoutes';
import reducer from './reducers';

registerRoutes();

export function ui() {
    return {
        reducer: () => reducer,
        route: async() => <Route key='utRule' path={getRoute('ut-rule:home')}>
            <Route path={getRoute('ut-rule:rules')}>
                <IndexRoute component={Rules} />
                <Route path={getRoute('ut-rule:create')}>
                    <IndexRoute component={RuleCreate} />
                </Route>
                <Route path={getRoute('ut-rule:edit')}>
                    <IndexRoute component={RuleEdit} />
                </Route>
            </Route>
        </Route>
    };
};
