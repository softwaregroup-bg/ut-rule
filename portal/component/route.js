import { registerRoute } from 'ut-front-react/routerHelper';

export default () => {
    registerRoute('ut-rule:rules').path('/rule.rule.browse');
    registerRoute('ut-rule:create').path('/rule.rule.new');
    registerRoute('ut-rule:edit').path('/rule.rule.open/:id');
};
