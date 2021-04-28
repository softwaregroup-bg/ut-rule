// @ts-check
import component from './component/index';

export default () => function utRule() {
    return {
        config: require('./config'),
        browser: () => [
            component
        ]
    };
};
