import React from 'react';
import { Route, Redirect, IndexRoute } from 'react-router';
import { Main } from './pages';
import { getRoute } from 'ut-front/react/routerHelper';
import registerRoutes from './registerRoutes';
export const mainRoute = registerRoutes();
export const UtRuleRoutes = () => {
    return (
        <Route>
            <Redirect from='/' to={getRoute('ut-rule:home')} />
            <Route path={getRoute('ut-rule:home')}>
                <IndexRoute component={Main} />
            </Route>
        </Route>
    );
};
