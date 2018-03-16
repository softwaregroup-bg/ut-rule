
import React from 'react';
import GridToolbox from 'ut-front-react/components/SimpleGridToolbox';

const ToolboxButtons = ({ selected, children, toggle, show }) => {
    let hasSelectedItem = Object.keys(selected).length > 0;
    let opened = hasSelectedItem ? show : false;
    let title = 'Show filters';
    return (
        <GridToolbox opened={opened} title={title} isTitleLink={hasSelectedItem} toggle={() => toggle()}>
            {children}
        </GridToolbox>
    );
};

export default ToolboxButtons;
