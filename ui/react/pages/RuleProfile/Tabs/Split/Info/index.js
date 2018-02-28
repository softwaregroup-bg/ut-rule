import React, { PropTypes } from 'react';
import Input from 'ut-front-react/components/Input';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import {splitTags} from '../../../helpers';
import style from '../../style.css';

export const Info = (props) => {
    const {
        changeInputField,
        changeMultiSelectField,
        selectedTags,
        splitIndex,
        name
    } = props;
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
                  options={splitTags}
                  onChange={(value) => { changeMultiSelectField(splitIndex, 'tags', value); }}
                />
            </div>
        </div>
    );
};

Info.propTypes = {
    changeInputField: PropTypes.func,
    changeMultiSelectField: PropTypes.func,
    selectedTags: PropTypes.array,
    splitIndex: PropTypes.number,
    name: PropTypes.string
};

export default Info;
