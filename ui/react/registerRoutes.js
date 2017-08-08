import { registerRoute } from 'ut-front/react/routerHelper';

export default () => {
    let mainRoute = 'ut-rule:home';
    // let rewriteRoute = 'ut-rule:rewrite';
    let createRule = 'ut-rule:create';
    registerRoute(mainRoute).path('/rule');
    registerRoute(createRule).path('/rule/create');
    return mainRoute;
};
