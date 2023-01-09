import PropTypes from 'prop-types';
import React from 'react';
import Input from 'ut-front-react/components/Input';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import { splitTags } from '../../../../../../common';
import {fromJS} from 'immutable';
import style from '../../style.css';

export const Info = (props) => {
    const {
        canEdit,
        changeInputField,
        selectedTags,
        name,
        errors
    } = props;
    return (
        <div>
            <div className={style.inputWrapper}>
                <Input
                    readonly={!canEdit}
                    keyProp='name'
                    label='Split Name'
                    isValid={!errors.getIn(['name'])}
                    errorMessage={errors.getIn(['name'])}
                    value={name}
                    onChange={(field) => changeInputField(field)}
                />
            </div>
            <div className={style.inputWrapper}>
                <MultiSelectBubble
                    disabled={!canEdit}
                    name='tag'
                    label='Tag'
                    value={selectedTags}
                    options={splitTags}
                    onChange={(value) => { changeInputField({key: 'tags', value}); }}
                />
            </div>
        </div>
    );
};

Info.propTypes = {
    canEdit: PropTypes.bool,
    changeInputField: PropTypes.func,
    selectedTags: PropTypes.array,
    name: PropTypes.string,
    errors: PropTypes.object // immutable
};

Info.defaultProps = {
    canEdit: true,
    errors: fromJS({})
};

export default Info;
