import React, { PropTypes } from 'react';
import style from '../../style.css';
import DatePicker from 'material-ui/DatePicker';
import Input from 'ut-front-react/components/Input';

const Operation = React.createClass({
    propTypes: {
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
        this.context.onFieldChange('condition', 0, 'operationStartDate', date.toString());
    },
    onChangeEndDate(event, date) {
        this.context.onFieldChange('condition', 0, 'operationEndDate', date.toString());
    },
    render() {
        let { onChangeInput, onChangeStartDate, onChangeEndDate } = this;
        return (
            <div className={style.content}>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='operationTag'
                      label='Tag'
                      onChange={onChangeInput}
                      value={'' + (this.props.data.operationTag || '')}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <DatePicker
                      hintText='Landscape Dialog'
                      mode='landscape'
                      onChange={onChangeStartDate}
                      value={this.props.data.operationStartDate ? new Date(this.props.data.operationStartDate) : null}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <DatePicker
                      hintText='Landscape Dialog'
                      mode='landscape'
                      onChange={onChangeEndDate}
                      value={this.props.data.operationEndDate ? new Date(this.props.data.operationEndDate) : null}
                    />
                </div>
            </div>
        );
    }
});

export default Operation;
