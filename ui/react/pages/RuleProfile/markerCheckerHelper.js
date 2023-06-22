import { compare } from 'ut-front-react/components/CompareGrid/helpers';
import immutable from 'immutable';

export function capitalizeFirstLetter(str) {
    try {
        return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (error) {
        return str;
    }
}

export function formatDate(dateString) {
    if (dateString === undefined) {
        return undefined;
    }
    const date = new Date(dateString);
    return date.toUTCString();
}

const parseConditionItemData = (conditionItems, factor) => {
    if (conditionItems === undefined) {
        return immutable.fromJS([]);
    }
    return conditionItems.map(item => {
        switch (factor) {
            case item.get('factor'):
                return {
                    key: capitalizeFirstLetter(item.get('itemTypeName')),
                    value: capitalizeFirstLetter(item.get('itemName'))
                };
            default:
                break;
        }
    }).filter(item => item !== undefined).toJS();
};

const parseConditionActorData = (conditionActors, factor) => {
    if (conditionActors === undefined) {
        return immutable.fromJS([]);
    }
    // console.log('conditionActors:', conditionActors && conditionActors.toJS())
    return conditionActors.map(item => {
        switch (factor) {
            case item.get('factor'):
                return {
                    key: capitalizeFirstLetter(item.get('type')),
                    value: item.get('actorName')// item.getIn(['actorId', 1]) // && item.get('actorId').length > 0 ? item.get('actorId')[0] : undefined
                };
            default:
                break;
        }
    }).filter(item => item !== undefined).toJS();
};

const parseConditionPropertyData = (conditionProperty, factor) => {
    if (conditionProperty === undefined) {
        return immutable.fromJS([]);
    }
    return conditionProperty.map(item => {
        switch (factor) {
            case item.get('factor'):
                return {
                    key: capitalizeFirstLetter(item.get('name')),
                    value: capitalizeFirstLetter(item.get('value'))
                };
            default:
                break;
        }
    }).filter(item => item !== undefined).toJS();
};

const generalInfoMapper = (values) => {
    // console.log('valuse: ', values && values.toJS());
    // debugger;
    return immutable.fromJS([
        {
            key: 'Priority',
            value: values.getIn(['condition', 'priority'])
        },
        {
            key: 'Status',
            value: capitalizeFirstLetter(values.getIn(['condition', 'status']))
        },
        {
            key: 'Lock',
            value: values.getIn(['condition', 'isEnabled']) ? 'Locked' : 'Unlocked'
        },
        ...parseConditionItemData(values.get('conditionItem'), 'cs'),
        ...parseConditionPropertyData(values.get('conditionProperty'), 'co'),
        ...parseConditionActorData(values.get('conditionActor'), 'co')
    ].filter(item => item.value !== undefined));
};

export function mapGeneralInfoData(currentValues, newValues, options) {
    const generalInfoCurrent = generalInfoMapper(currentValues);
    const generalInfoUnapproved = generalInfoMapper(newValues);
    return compare('Channel')(generalInfoCurrent, generalInfoUnapproved, options);
}

const operationItemDataMapper = (values) => {
    return immutable.fromJS([
        ...parseConditionItemData(values.get('conditionItem'), 'oc'),
        {
            key: 'Operation Start Date',
            value: formatDate(values.getIn(['condition', 'operationStartDate']))
        },
        {
            key: 'Operation End Date',
            value: formatDate(values.getIn(['condition', 'operationEndDate']))
        },
        ...parseConditionPropertyData(values.get('conditionProperty'), 'oc')
        // ...cnditionItemStatusParser(values.get('conditionItem'), 'oc'),
    ].filter(item => item.value !== undefined));
};

export function operationInfoData(currentValues, newValues, options) {
    const currentOperation = operationItemDataMapper(currentValues);
    const newOperation = operationItemDataMapper(newValues);
    return compare('Operation')(currentOperation, newOperation, options);
}

const sourceDataMapper = (values) => {
    return immutable.fromJS([
        ...parseConditionItemData(values.get('conditionItem'), 'ss'),
        ...parseConditionItemData(values.get('conditionItem'), 'sc'),
        ...parseConditionPropertyData(values.get('conditionProperty'), 'so'),
        ...parseConditionActorData(values.get('conditionActor'), 'so')
    ].filter(item => item.value !== undefined));
};

export function sourceInfoData(currentValues, newValues, options) {
    const currentSource = sourceDataMapper(currentValues);
    const newSource = sourceDataMapper(newValues);
    return compare('Source')(currentSource, newSource, options);
}

const destinationDataMapper = (values) => {
    return immutable.fromJS([
        ...parseConditionItemData(values.get('conditionItem'), 'ds'),
        ...parseConditionItemData(values.get('conditionItem'), 'dc'),
        ...parseConditionPropertyData(values.get('conditionProperty'), 'do'),
        ...parseConditionActorData(values.get('conditionActor'), 'do')
    ].filter(item => item.value !== undefined));
};

export function destinationInfoData(currentValues, newValues, options) {
    const currentDestination = destinationDataMapper(currentValues);
    const newDestination = destinationDataMapper(newValues);
    return compare('Destination')(currentDestination, newDestination, options);
}

const seperateUpperCaseWords = (word) => {
    try {
        return capitalizeFirstLetter(word).match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
    } catch (error) {
        if (word !== undefined) {
            return capitalizeFirstLetter(word);
        }
        return word;
    }
};

const splitDataMapper = (values, key) => {
    if (values.has(key) && values.get(key) !== undefined && values.get(key).size > 0) {
        const results = [];
        values.get(key).map(split => {
            Object.keys(split.toJS()).forEach(key => {
                if (key !== 'status') {
                    results.push({
                        key: seperateUpperCaseWords(key),
                        value: capitalizeFirstLetter(typeof (split.get(key)) === 'boolean' ? split.get(key).toString() : split.get(key))
                    });
                }
            });
        });
        return immutable.fromJS(results.filter(item => item.value !== null && !(item.key.includes('Id') || item.key.startsWith('id'))));
    }
    return immutable.fromJS([]);
};

export function splitInfoData(currentValues, newValues, options, title, key) {
    const currentSplit = splitDataMapper(currentValues, key);
    const newSplit = splitDataMapper(newValues, key);
    return compare(title)(currentSplit, newSplit, options);
}
