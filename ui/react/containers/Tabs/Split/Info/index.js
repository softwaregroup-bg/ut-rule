import React from 'react';
import Input from 'ut-front-react/components/Input';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';

import style from '../style.css';
import plusImage from '../assets/add_new.png';
import deleteImage from '../assets/delete.png';

export const Assignments = (props) => {
    const {
        changeInputField,
        changeMultiSelectField,
        selectedTags,
        splitIndex,
        name
    } = props;

    const tags = [
        {key: 'acquirer', name: 'Acquirer'},
        {key: 'issuer', name: 'Issuer'},
        {key: 'commission', name: 'Commission'},
        {key: 'realtime', name: 'Realtime posting'},
        {key: 'pending', name: 'Authorization required'},
        {key: 'agent', name: 'Agent'},
        {key: 'fee', name: 'Fee'},
        {key: 'atm', name: 'ATM'},
        {key: 'pos', name: 'POS'},
        {key: 'ped', name: 'PED'},
        {key: 'vendor', name: 'Vendor'},
        {key: 'merchant', name: 'Merchant'}
    ];

    return (
        <div>
            <div className={style.inputWrapper}>
                <Input
                  label='Split Name'
                  value={name}
                  onChange={({value}) => changeInputField(splitIndex, 'name', value)}
                />
            </div>
            <div className={style.inputWrapper}>
                <MultiSelectBubble
                  name='tag'
                  label={'Tag'}
                  value={selectedTags}
                  options={tags}
                  onChange={(value) => { changeMultiSelectField(splitIndex, 'tags', value); }}
                />
            </div>
        </div>
    );
};

export default Assignments;
