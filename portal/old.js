// @ts-check
import component from './component/old';

export default () => function utRule() {
    return {
        config: require('./config'),
        browser: () => [
            component
        ]
    };
};
