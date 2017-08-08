export const formatRuleItems = (items) => {
    let formattedPayload = {};

    items.map(item => {
        if (!formattedPayload[item.type]) {
            formattedPayload[item.type] = [];
        }
        formattedPayload[item.type].push({
            key: item.value,
            name: item.display
        });
    });

    return formattedPayload;
};

export const prepateRuleToSave = ({
    destination,
    source,
    operation,
    channel,
    split,
    limit
}) => {
    let formattedRule = {};
    formattedRule.condition = [{
        priority: channel.priority,
        operationStartDate: operation.startDate || null,
        operationEndDate: operation.endDate || null,
        sourceAccontId: null,
        destinationAccountId: null
    }];

    const factors = {
        sourceOrganization: 'so',
        destinationOrganization: 'do',
        channelOrganization: 'co',
        sourceSpatial: 'ss',
        destinationSpatial: 'ds',
        channelSpatial: 'cs',
        operationCategory: 'oc',
        sourceCategory: 'sc',
        destinationCategory: 'dc'
    };

    formattedRule.conditionActor = [];
    channel.organization && formattedRule.conditionActor.push(
        {
            actorId: channel.organization,
            factor: factors.channelOrganization
        }
    );
    source.organization && formattedRule.conditionActor.push(
        {
            actorId: source.organization,
            factor: factors.sourceOrganization
        }
    );
    destination.organization && formattedRule.conditionActor.push(
        {
            actorId: destination.organization,
            factor: factors.destinationOrganization
        }
    );

    formattedRule.conditionItem = [];

    channel.cities.forEach(city => {
        formattedRule.conditionItem.push({
            itemNameId: city.key,
            factor: factors.channelSpatial
        });
    });

    channel.countries.forEach(country => {
        formattedRule.conditionItem.push({
            itemNameId: country.key,
            factor: factors.channelSpatial
        });
    });

    channel.regions.forEach(region => {
        formattedRule.conditionItem.push({
            itemNameId: region.key,
            factor: factors.channelSpatial
        });
    });

    destination.cities.forEach(city => {
        formattedRule.conditionItem.push({
            itemNameId: city.key,
            factor: factors.destinationSpatial
        });
    });

    destination.countries.forEach(country => {
        formattedRule.conditionItem.push({
            itemNameId: country.key,
            factor: factors.destinationSpatial
        });
    });

    destination.regions.forEach(region => {
        formattedRule.conditionItem.push({
            itemNameId: region.key,
            factor: factors.destinationSpatial
        });
    });

    source.cities.forEach(city => {
        formattedRule.conditionItem.push({
            itemNameId: city.key,
            factor: factors.sourceSpatial
        });
    });

    source.countries.forEach(country => {
        formattedRule.conditionItem.push({
            itemNameId: country.key,
            factor: factors.sourceSpatial
        });
    });

    source.regions.forEach(region => {
        formattedRule.conditionItem.push({
            itemNameId: region.key,
            factor: factors.sourceSpatial
        });
    });

    operation.operations.forEach(operation => {
        formattedRule.conditionItem.push({
            itemNameId: operation.key,
            factor: factors.operationCategory
        });
    });

    formattedRule.conditionItem.push({
        factor: factors.sourceSpatial,
        itemNameId: source.product
    });

    formattedRule.conditionProperty = [];

    source.properties.forEach(prop => {
        formattedRule.conditionProperty.push({
            factor: factors.sourceOrganization,
            name: prop.name,
            value: prop.value
        });
    });

    operation.properties.forEach(prop => {
        formattedRule.conditionProperty.push({
            factor: factors.operationCategory,
            name: prop.name,
            value: prop.value
        });
    });

    channel.properties.forEach(prop => {
        formattedRule.conditionProperty.push({
            factor: factors.channelOrganization,
            name: prop.name,
            value: prop.value
        });
    });

    destination.properties.forEach(prop => {
        formattedRule.conditionProperty.push({
            factor: factors.destinationOrganization,
            name: prop.name,
            value: prop.value
        });
    });

    formattedRule.limit = [];
    limit.limits.forEach(limit => {
        formattedRule.limit.push({
            currency: limit.currency,
            minAmount: limit.txMin,
            maxAmount: limit.txMax,
            maxAmountDaily: limit.dailyMaxAmount,
            maxCountDaily: limit.dailyMaxCount,
            maxAmountWeekly: limit.weeklyMaxAmount,
            maxCountWeekly: limit.weeklyMaxCount,
            maxAmountMonthly: limit.monthlyMaxAmount,
            maxCountMonthly: limit.monthlyMaxCount
        });
    });

    formattedRule.split = {data: {rows: []}};
    split.splits.forEach(split => {
        let formattedSplit = {};
        formattedSplit.splitName = {
            name: split.name,
            tag: `|${split.tags.map(tag => tag.key).join('|')}|`
        };

        formattedSplit.splitAssignment = [
            ...split.assignments.map(assignment => ({
                debit: assignment.debit,
                credit: assignment.credit,
                minValue: assignment.minAmount,
                maxValue: assignment.maxAmount,
                percent: assignment.percent,
                description: assignment.description
            }))
        ];

        formattedSplit.splitRange = [];

        split.cumulatives.forEach(cumulative => {
            cumulative.ranges.forEach(range => {
                formattedSplit.splitRange.push({
                    startAmount: range.startAmount,
                    isSourceAmount: false,
                    minValue: range.minAmount,
                    maxValue: range.maxAmount,
                    percent: range.percent,
                    startAmountDaily: cumulative.dailyAmount,
                    startCountDaily: cumulative.dailyCount,
                    startAmountMonthly: cumulative.monthlyAmount,
                    startCountMonthly: cumulative.monthlyCount,
                    startAmountWeekly: cumulative.weeklyAmount,
                    startCountWeekly: cumulative.weeklyCount,
                    startAmountCurrency: cumulative.currency
                });
            });
        });

        formattedRule.split.data.rows.push(formattedSplit);
    });

    return formattedRule;
};
