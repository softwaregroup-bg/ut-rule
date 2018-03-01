import { textValidations } from 'ut-front-react/validator/constants.js';

module.exports = {
    priority: [
        {type: textValidations.isRequired, errorMessage: 'Priority is required.'},
        {type: textValidations.numberOnly, errorMessage: 'Priority should be a number'}
    ],
    count: [
        {type: textValidations.numberOnly, errorMessage: 'Count should be a number'}
    ],
    percent: [
        {type: textValidations.numberOnly, errorMessage: 'Percent should contains digits only'}
    ],
    amont: [
        {type: textValidations.numberOnly, errorMessage: 'Amount should contains digits only'}
    ]
};
