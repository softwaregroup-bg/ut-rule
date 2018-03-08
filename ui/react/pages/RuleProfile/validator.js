import { textValidations } from 'ut-front-react/validator/constants.js';

const errorMessage = {
    priorityRequired: 'Priority is required',
    propertyNameRequired: 'Property name is required',
    currencyRequired: 'Currency is required',
    splitNameRequired: 'Split name is required',
    minLessThanMaxAmount: 'Min amount should be less than max amount',
    dailyCount: 'Daily count should be less than weekly and monthly count',
    weeklyCount: 'Weekly count should be less than monthly count',
    monthlyCount: 'Weekly count should be less than monthly count',
    dailyAmount: 'Daily amount should be less than weekly and monthly amount',
    weeklyAmount: 'Weekly amount should be less than monthly amount',
    // limit
    dailyMaxCount: 'Daily count should be less than weekly and monthly count',
    weeklyMaxCount: 'Weekly count should be less than monthly count and greater than daily count',
    monthlyMaxCount: 'Monthly count should be greater than daily and weekly count',
    txMin: 'Transaction min amount should be less than max amount, daily, weekly and monthly amount',
    txMax: 'Transaction max amount should be less than daily, weekly, monthly amount and greater than its min amount',
    dailyMaxAmount: 'Daily max amount should be less than weekly, monthly amount and greater than its min, max amount',
    weeklyMaxAmount: 'Weekly max amount should be less than monthly amount and greater than its min, max and daily max mount',
    monthlyMaxAmount: 'Monthly max amount should be greater than its min, max, daily max and weekly max amount '
};

export const validations = {
    priority: [
        {type: textValidations.isRequired, errorMessage: errorMessage.priorityRequired},
        {type: textValidations.numberOnly, errorMessage: 'Priority should be a number'}
    ],
    count: [
        {type: textValidations.numberOnly, errorMessage: 'Please enter a valid number'}
    ],
    percent: [
        {type: textValidations.decimalOnly, precision: 12, scale: 2, errorMessage: 'Please enter a valid percent ex. 10.50'}
    ],
    amount: [
        {type: textValidations.decimalOnly, precision: 12, scale: 2, errorMessage: 'Please enter a valid amount ex. 10.50'}
    ]
};
const validate = (order) => {
    return function fieldValidate(field, tabObj, errors, clearLinkedErrors = true) {
        if (!field.value || isNaN(parseFloat(field.value))) return field;
        let smallArr = [];
        let highArr = [];
        let baseKeyArr = field.key.split(',').slice(0, field.key.split(',').length - 1);
        let values = tabObj.getIn(baseKeyArr).toJS();
        let value = parseFloat(field.value || 0);
        let key = field.key.split(',').pop();
        if (clearLinkedErrors) { // this is the logic to clear errors of its related object when it gets valid
            let clonedOrder = order.slice(0);
            clonedOrder.splice(order.indexOf(key), 1);
            tabObj = tabObj.setIn(field.key.split(','), field.value);
            field.clearLinkedErrors = [];
            clonedOrder.forEach((lkey) => {
                var ckeyArr = [...baseKeyArr, lkey];
                var ckey = ckeyArr.join(',');
                var cfield = fieldValidate({
                    key: ckey,
                    value: tabObj.getIn(ckeyArr),
                    error: !!errors.getIn(ckeyArr),
                    errorMessage: errors.getIn(ckeyArr)
                }, tabObj, errors, false);
                cfield && !cfield.error && field.clearLinkedErrors.push(ckey);
            });
        }
        order.slice(order.indexOf(key) + 1, order.length).map((hkey) => {
            values[hkey] && highArr.push(parseFloat(values[hkey]) || 0);
        });
        order.slice(0, order.indexOf(key)).map((skey) => {
            values[skey] && smallArr.push(parseFloat(values[skey]) || 0);
        });
        if ((Math.max(...smallArr) > value || Math.min(...highArr) < value)) {
            field.error = true;
            field.errorMessage = errorMessage[key];
        } else {
            field.error = false;
            field.errorMessage = null;
        }
        return field;
    };
};
const limitAmountOrder = ['txMin', 'txMax', 'dailyMaxAmount', 'weeklyMaxAmount', 'monthlyMaxAmount'];
const limitCountOrder = ['dailyMaxCount', 'weeklyMaxCount', 'monthlyMaxCount'];
const limitAmountValidate = validate(limitAmountOrder);
const limitCountValidate = validate(limitCountOrder);
export const externalValidate = {
    limit_txMin: limitAmountValidate,
    limit_txMax: limitAmountValidate,
    limit_dailyMaxAmount: limitAmountValidate,
    limit_weeklyMaxAmount: limitAmountValidate,
    limit_monthlyMaxAmount: limitAmountValidate,
    limit_dailyMaxCount: limitCountValidate,
    limit_weeklyMaxCount: limitCountValidate,
    limit_monthlyMaxCount: limitCountValidate
};

// export function getChannelTabValidator() {
//     return [
//         {
//             key: ['channel', 'priority'],
//             type: validationTypes.text,
//             rules: validations.priority
//         }
//     ];
// }
