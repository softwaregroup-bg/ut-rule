import React, { PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';

import { Rules, RulesCreate } from './pages';
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
                <IndexRoute component={Rules} />
            </Route>
            <Route path={getRoute('ut-rule:create')}>
                <IndexRoute component={RulesCreate} />
            </Route>
        </Route>
    );
};
