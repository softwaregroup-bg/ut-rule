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
