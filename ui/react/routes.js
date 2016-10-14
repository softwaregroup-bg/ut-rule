import React, { PropTypes } from 'react';
import { Route, Redirect } from 'react-router';
import { Home } from './pages';

const Wrapper = React.createClass({
    propTypes: {
        children: PropTypes.node,
        location: PropTypes.object
    },
    contextTypes: {
        router: PropTypes.object,
        checkPermission: PropTypes.func
    },
    componentWillMount() {
        // perform custom logic i.e. redirect, check permissions, show maintenance mode...
    },
    componentWillReceiveProps() {
        // perform custom logic i.e. redirect, check permissions, show maintenance mode...
    },
    render() {
        return this.props.children;
    }
});

export default (
    <Route component={Wrapper}>
        <Redirect from='/' to='/home' />
        <Route path='home' component={Home} />
    </Route>
);
