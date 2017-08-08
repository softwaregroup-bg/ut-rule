import { registerRoute } from 'ut-front/react/routerHelper';

export default () => {
    let mainRoute = 'ut-rule:home';
    let rewriteRoute = 'ut-rule:rewrite';
    let createRule = 'ut-rule:detail';
    registerRoute(mainRoute).path('/rule');
    registerRoute(rewriteRoute).path('/rule/rewrite');
    registerRoute(createRule).path('/rule/create');
    return mainRoute;
};
