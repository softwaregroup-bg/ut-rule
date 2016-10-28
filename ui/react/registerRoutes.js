import { registerRoute } from 'ut-front/react/routerHelper';
export default () => {
    let mainRoute = 'ut-rule:home';
    registerRoute(mainRoute).path('/rule');
    return mainRoute;
};
