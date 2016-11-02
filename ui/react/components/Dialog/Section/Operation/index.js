import React, { PropTypes } from 'react';
import style from '../../style.css';
import DatePicker from 'material-ui/DatePicker';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const Operation = React.createClass({
    propTypes: {
        nomenclatures: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func
    },
    onSelectDropdown(field) {
        this.context.onFieldChange('condition', 0, field.key, field.value);
    },
    onChangeInput(field) {
        this.context.onFieldChange('condition', 0, field.key, field.value);
    },
    onChangeStartDate(event, date) {
        this.context.onFieldChange('condition', 0, 'operationStartDate', date);
    },
    onChangeEndDate(event, date) {
        this.context.onFieldChange('condition', 0, 'operationEndDate', date);
    },
    render() {
        let { region } = this.props.nomenclatures;
        let { onSelectDropdown, onChangeStartDate, onChangeEndDate } = this;
        return (
            <div className={style.content}>
                <div className={style.inputWrapper}>
                    <Dropdown
                      keyProp='operationTag'
                      label='Tag'
                      data={region}
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.operationTag || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <DatePicker
                      hintText='Landscape Dialog'
                      mode='landscape'
                      onChange={onChangeStartDate}
                      value={this.props.data.operationStartDate || null}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <DatePicker
                      hintText='Landscape Dialog'
                      mode='landscape'
                      onChange={onChangeEndDate}
                      value={this.props.data.operationEndDate || null}
                    />
                </div>
            </div>
        );
    }
});

export default Operation;
