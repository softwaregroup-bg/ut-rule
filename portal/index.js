import component from './component';
import backend from './backend';
import config from './config';

export default () => function utRule() {
    return {
        config,
        browser: () => [
            backend,
            ...component
        ]
    };
};
