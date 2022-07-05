// @ts-check
import React from 'react';
import {useLocation} from 'react-router-dom';

/** @type { import("../../handlers").libFactory } */
export default () => ({
    page: function usePage(Component, params = {}, rest) {
        const location = useLocation();
        return <Component match={{params}} location={location} {...(rest || {})} />;
    }
});
