import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import DatePicker from '../../../DatePicker';

const Operation = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func
    },
    onChangeInput(field) {
        this.context.onFieldChange('condition', 0, field.key, field.value);
    },
    onChangeDate(fieldKey) {
        var self = this;
        return (field) => {
            self.context.onFieldChange('condition', 0, fieldKey, field.value);
        };
    },
    render() {
        let { onChangeInput, onChangeDate } = this;
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
                    <div className={style.outerWrap}>
                        <div className={style.lableWrap}>Start Date</div>
                        <div className={style.inputWrap}>
                            <DatePicker
                              keyProp='operationStartDate'
                              mode='landscape'
                              onChange={onChangeDate('operationStartDate')}
                              defaultValue={this.props.data.operationStartDate ? new Date(this.props.data.operationStartDate) : null}
                            />
                        </div>
                    </div>
                </div>
                <div className={style.inputWrapper}>
                    <div className={style.outerWrap}>
                        <div className={style.lableWrap}>End Date</div>
                        <div className={style.inputWrap}>
                            <DatePicker
                              keyProp='operationEndDate'
                              mode='landscape'
                              onChange={onChangeDate('operationEndDate')}
                              defaultValue={this.props.data.operationEndDate ? new Date(this.props.data.operationEndDate) : null}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default Operation;
