import { registerRoute } from 'ut-front-react/routerHelper';

export default () => {
    const mainRoute = 'ut-rule:home';
    registerRoute(mainRoute).path('/rule');
    registerRoute('ut-rule:rules').path('rules').parent(mainRoute);
    registerRoute('ut-rule:create').path('create').parent('ut-rule:rules');
    registerRoute('ut-rule:edit').path('edit/:id').parent('ut-rule:rules');
    return mainRoute;
};
