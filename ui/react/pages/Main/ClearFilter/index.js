import React from 'react';
import ClearFilter from 'ut-front-react/components/ClearFilter';

const ToolboxClearFilter = ({ filterData, childred, clearFilter }) => {
    let {operation, priority} = filterData;
    let show = operation.length !== 0 || priority.from.value !== null || priority.to.value !== null;
    return (
        <ClearFilter show={show} onClick={clearFilter} />
    );
};

export default ToolboxClearFilter;
