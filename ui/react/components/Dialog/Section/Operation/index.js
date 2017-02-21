import React, { PropTypes } from 'react';
import style from '../../style.css';
import DatePicker from 'ut-front-react/components/DatePicker/Simple';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import MultiSelect from 'ut-front-react/components/Input/MultiSelectDropdown';

const Operation = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired,
        fields: PropTypes.object
    },
    contextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object
    },
    getInitialState() {
        return {
            fields: this.props.fields
        };
    },
    getTagData() {
        return [
            {key: 'AT03', name: 'AIRTEL'},
            {key: 'AT04', name: 'EXPRESSO'},
            {key: 'AT00', name: 'MTN'},
            {key: 'AT02', name: 'TIGO'},
            {key: 'AT01', name: 'VODAFONE'},
            {key: 'DSTV', name: 'DSTV'},
            {key: 'ECG', name: 'ECG'}
        ];
    },
    defaultSelected(origin, selected) {
        let result = [];

        selected.forEach(function(row) {
            result.push(origin.filter(function(r) {
                return r.key === row.key;
            })[0]);
        });

        return result;
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
    onSelectDropdown(field) {
        this.context.onFieldChange('condition', 0, field.key, field.value);
    },
    render() {
        const { onChangeInput, onChangeDate, getTagData } = this;
        const { operation } = this.context.nomenclatures;
        const fields = this.state.fields;

        return (
            <div className={style.content}>
                {fields.tag.visible &&
                    <div className={style.inputWrapper}>
                        <MultiSelect
                          placeholder='Select Tags'
                          defaultSelected={this.defaultSelected(getTagData(), this.props.data.operationTag || [])}
                          onSelect={onChangeInput}
                          data={getTagData()}
                          label='Tag'
                          keyProp='operationTag'
                        />
                        {/* <Input
                          keyProp='operationTag'
                          label={fields.tag.title}
                          onChange={onChangeInput}
                          value={'' + (this.props.data.operationTag || '')}
                        / --> */}
                    </div>
                }
                {fields.operationId.visible &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='operationId'
                          label={fields.operationId.title}
                          data={operation}
                          placeholder={fields.operationId.title}
                          onSelect={this.onSelectDropdown}
                          defaultSelected={'' + (this.props.data.operationId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.operationStartDate.visible &&
                    <div className={style.inputWrapper}>
                        <div className={style.outerWrap}>
                            <div className={style.lableWrap}>{fields.operationStartDate.title}</div>
                            <div className={style.inputWrap}>
                                <DatePicker
                                  wrapperStyles={{backgroundColor: 'white'}}
                                  keyProp='operationStartDate'
                                  mode='landscape'
                                  onChange={onChangeDate('operationStartDate')}
                                  defaultValue={this.props.data.operationStartDate ? new Date(this.props.data.operationStartDate) : null}
                                />
                            </div>
                        </div>
                    </div>
                }
                {fields.operationEndDate.visible &&
                    <div className={style.inputWrapper}>
                        <div className={style.outerWrap}>
                            <div className={style.lableWrap}>{fields.operationEndDate.title}</div>
                            <div className={style.inputWrap}>
                                <DatePicker
                                  wrapperStyles={{backgroundColor: 'white'}}
                                  keyProp='operationEndDate'
                                  mode='landscape'
                                  onChange={onChangeDate('operationEndDate')}
                                  minDate={this.props.data.operationStartDate ? new Date(this.props.data.operationStartDate) : new Date()}
                                  defaultValue={this.props.data.operationEndDate ? new Date(this.props.data.operationEndDate) : null}
                                />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
});

export default Operation;
