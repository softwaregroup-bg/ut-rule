import React from 'react';
import Text from 'ut-front-react/components/Text';
import dialogStyles from './style.css';

export function getDialogTitle(titleText) {
    return <div className={dialogStyles.titleWrap}>
        <h3><Text>{titleText}</Text><span className={dialogStyles.closeBtn}>X</span></h3>
    </div>;
};

export const titleStyle = {
    backgroundColor: '#F5F5F5',
    padding: '15px 0 5px 0'
};
