import React from 'react';
import reducer from './reducers';
import RuleRoutes from './routes';

export function ui() {
    return {
        reducer: () => reducer,
        route: async() => <RuleRoutes key='utRule' />
    };
};
