import React, { PropTypes } from 'react';
import style from '../style.css';
import DateInput from 'ut-front-react/components/Input/DateInput';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const SectionOperation = React.createClass({
    propTypes: {
        regions: PropTypes.array
    },
    onSelectDropdown() {},
    render() {
        let { regions } = this.props;
        let { onSelectDropdown } = this;
        return (
            <div className={style.content}>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={regions}
                      keyProp='operationTagId'
                      placeholder='Select tag'
                      onSelect={onSelectDropdown}
                      label='Tag'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <DateInput
                      label='Start Date'
                      placeholder='Choose a start date'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <DateInput
                      label='End Date'
                      placeholder='Choose a end date'
                    />
                </div>
            </div>
        );
    }
});

export default SectionOperation;
