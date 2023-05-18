import { textValidations } from 'ut-front-react/validator/constants.js';
const limitAmountOrder = ['txMin', 'txMax', 'dailyMaxAmount', 'weeklyMaxAmount', 'monthlyMaxAmount'];
const limitCountOrder = ['dailyMaxCount', 'weeklyMaxCount', 'monthlyMaxCount'];
const minMaxOrder = ['minAmount', 'maxAmount'];
const splitCumulativeAmountOrder = ['dailyAmount', 'weeklyAmount', 'monthlyAmount'];
const splitCumulativeCountOrder = ['dailyCount', 'weeklyCount', 'monthlyCount'];
export const errorMessage = {
    priorityRequired: 'Priority is required',
    nameRequired: 'Name is required',
    propertyNameRequired: 'Property name is required',
    propertyNameUnique: 'Property name should be unique with channel, operation, source and destination properties',
    currencyRequired: 'Currency is required',
    // split
    splitNameRequired: 'Split name is required',
    splitNameUnique: 'Split name should be unique',
    minAmount: 'Min amount <= Max amount',
    maxAmount: 'Max amount >= Min amount',
    dailyCount: 'Daily count <= Weekly and Monthly count',
    weeklyCount: 'Weekly count <= Monthly count and Weekly count >= Daily count',
    monthlyCount: 'Monthly count >= Daily and Monthly count',
    dailyAmount: 'Daily amount <= Weekly and Monthly amount',
    weeklyAmount: 'Weekly amount <= Monthly amount and Weekly amount >= Daily amount',
    monthlyAmount: 'Monthly amount >= Daily and Monthly amount',
    startAmountRequired: 'Start amount is required',
    descriptionRequired: 'Description is required',
    creditRequired: 'Credit is required',
    startAmountUnique: 'Start amount should be unique with in its cumulative',
    cumulativeCurrencyUnique: 'Currency should be unique withn in its split',
    // limit
    limitCurrencyUnique: 'Limit currency should be unique',
    dailyMaxCount: 'Daily count <= Weekly and Monthly count',
    weeklyMaxCount: 'Weekly count <= Monthly count and Weekly count >= Daily count',
    monthlyMaxCount: 'Monthly count >= Daily and Weekly count',
    txMin: 'Transaction min amount <= Max, Daily, Weekly and Monthly amount',
    txMax: 'Transaction max amount <= Daily, Weekly, Monthly amount and Transaction max amount >= Min amount',
    dailyMaxAmount: 'Daily max amount <= Weekly, Monthly amount and Daily max amount >= Min, Max amount',
    weeklyMaxAmount: 'Weekly max amount <= Monthly amount and Weekly max amount >= Min, Max and Daily max mount',
    monthlyMaxAmount: 'Monthly max amount >= Min, Max, Daily max and Weekly max amount '
};

export const validations = {
    priority: [
        {type: textValidations.isRequired, errorMessage: errorMessage.priorityRequired},
        {type: textValidations.numberOnly, errorMessage: 'Priority should be a number'},
        {type: textValidations.regex, value: /^[1-9][0-9]{0,9}$/, errorMessage: 'Priority should be between 1 and 9999999999'}
    ],
    name: [
        {type: textValidations.isRequired, errorMessage: errorMessage.nameRequired}// ,
        // {type: textValidations.regex, value: /[^A-Za-z0-9]+/, errorMessage: 'Name should be string'}
    ],
    count: [
        {type: textValidations.numberOnly, errorMessage: 'Please enter a valid number'}
    ],
    percent: [
        {type: textValidations.decimalOnly, precision: 12, scale: 2, errorMessage: 'Please enter a valid percent ex. 10.500'}
    ],
    amount: [
        {type: textValidations.decimalOnly, precision: 12, scale: 2, errorMessage: 'Please enter a valid amount ex. 10.50'}
    ]
};

// used to validate amount, count o split, limit fields
const validate = (order) => {
    return function fieldValidate(field, tabObj, errors, clearLinkedErrors = true) {
        const smallArr = [];
        const highArr = [];
        const baseKeyArr = field.key.split(',').slice(0, field.key.split(',').length - 1);
        const values = tabObj.getIn(baseKeyArr).toJS();
        const value = parseFloat(field.value || 0);
        const key = field.key.split(',').pop();
        if (clearLinkedErrors) { // this is the logic to clear errors of its related object when it gets valid
            const clonedOrder = order.slice(0);
            clonedOrder.splice(order.indexOf(key), 1);
            tabObj = tabObj.setIn(field.key.split(','), field.value);
            field.clearLinkedErrors = [];
            clonedOrder.forEach((lkey) => {
                const ckeyArr = [...baseKeyArr, lkey];
                const ckey = ckeyArr.join(',');
                const cfield = fieldValidate({
                    key: ckey,
                    value: tabObj.getIn(ckeyArr),
                    error: !!errors.getIn(ckeyArr),
                    errorMessage: errors.getIn(ckeyArr)
                }, tabObj, errors, false);
                cfield && !cfield.error && field.clearLinkedErrors.push(ckey);
            });
        }
        if (!field.value || isNaN(parseFloat(field.value))) return field;
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

const limitAmountValidate = validate(limitAmountOrder);
const limitCountValidate = validate(limitCountOrder);
const minMaxValidate = validate(minMaxOrder);
const splitCumulativeAmountValidate = validate(splitCumulativeAmountOrder);
const splitCumulativeCountValidate = validate(splitCumulativeCountOrder);
export const externalValidate = {
    limit_txMin: limitAmountValidate,
    limit_txMax: limitAmountValidate,
    limit_dailyMaxAmount: limitAmountValidate,
    limit_weeklyMaxAmount: limitAmountValidate,
    limit_monthlyMaxAmount: limitAmountValidate,
    limit_dailyMaxCount: limitCountValidate,
    limit_weeklyMaxCount: limitCountValidate,
    limit_monthlyMaxCount: limitCountValidate,
    split_assignement_minAmount: minMaxValidate,
    split_assignement_maxAmount: minMaxValidate,
    split_cumulative_range_minAmount: minMaxValidate,
    split_cumulative_range_maxAmount: minMaxValidate,
    split_cumulative_dailyAmount: splitCumulativeAmountValidate,
    split_cumulative_weeklyAmount: splitCumulativeAmountValidate,
    split_cumulative_monthlyAmount: splitCumulativeAmountValidate,
    split_cumulative_dailyCount: splitCumulativeCountValidate,
    split_cumulative_weeklyCount: splitCumulativeCountValidate,
    split_cumulative_monthlyCount: splitCumulativeCountValidate
};
