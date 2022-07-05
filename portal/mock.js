import {backendMock} from 'ut-model';

import model from '../model';
import mock from '../model/mock';

export default () => function utRule() {
    return backendMock(model, () => mock);
};
