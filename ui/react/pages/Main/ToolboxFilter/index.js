
import React from 'react';
import GridToolbox from 'ut-front-react/components/SimpleGridToolbox';

const ToolboxFilter = ({ selected, children, toggle, show }) => {
    let hasSelectedItem = Object.keys(selected).length > 0;
    let opened = hasSelectedItem ? show : true;
    let title = hasSelectedItem ? 'Show Buttons' : 'Filter by';
    return (
        <GridToolbox opened={opened} title={title} isTitleLink={hasSelectedItem} toggle={() => toggle()}>
            {children}
        </GridToolbox>
    );
};

export default ToolboxFilter;
