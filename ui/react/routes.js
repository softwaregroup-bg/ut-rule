import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Main } from './pages';

export default (
    <Route>
        <IndexRoute component={Main} />
    </Route>
);
