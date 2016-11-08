import React, { PropTypes } from 'react';
import { Route, Redirect, IndexRoute } from 'react-router';
import { Main } from './pages';
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
            <Redirect from='/' to={getRoute('ut-rule:home')} />
            <Route path={getRoute('ut-rule:home')}>
                <IndexRoute component={Main} />
            </Route>
        </Route>
    );
};
