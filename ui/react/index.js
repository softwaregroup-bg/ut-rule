import React, { PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';

import { Main } from './pages';
import Rewrite from './pages/Rewrite';
import Tab from './containers/Tabs/Index';
import { getRoute } from 'ut-front/react/routerHelper';
import registerRoutes from './registerRoutes';

export const mainRoute = registerRoutes();
const getLocalProvider = (config) => {
    return React.createClass({
        propTypes: {
            children: PropTypes.object
        },
        childContextTypes: {
            config: PropTypes.object
        },
        getChildContext() {
            return {
                config: config
            };
        },
        render() {
            return this.props.children;
        }
    });
};

export const UtRuleRoutes = (config) => {
    return (
        <Route component={getLocalProvider(config)}>
            <Route path={getRoute('ut-rule:home')}>
                <IndexRoute component={Main} />
            </Route>
            <Route path={getRoute('ut-rule:rewrite')}>
                <IndexRoute component={Rewrite} />
            </Route>
            <Route path={getRoute('ut-rule:detail')}>
                <IndexRoute component={Tab} />
            </Route>
        </Route>
    );
};
