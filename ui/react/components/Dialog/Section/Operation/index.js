import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import DatePicker from 'ut-front-react/components/DatePicker/Simple';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const Operation = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired,
        fields: PropTypes.object,
        addPropertyRow: PropTypes.func.isRequired,
        properties: PropTypes.array.isRequired
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
    onChangePropertyInput(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('operationProperties', index, field.key, field.value);
        };
    },
    onDeletePropertyRow(index) {
        let self = this;
        return () => {
            self.props.deletePropetyRow(index);
        };
    },
    createPropertyHeaderCells() {
        return [
            {name: 'Name', key: 'name'},
            {name: 'Value', key: 'value'},
            {name: '', key: 'rangeActions', className: style.deleteButton}
        ].map((cell, i) => (
            <th key={i} className={cell.className || ''}>{cell.name}</th>
        ));
    },
    createPropetyRows() {
        return this.props.properties.map((operationProperties, index) => (
            <tr key={index}>
                <td>
                    <Input
                      keyProp='name'
                      onChange={this.onChangePropertyInput(index)}
                      value={'' + (operationProperties.name || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='value'
                      onChange={this.onChangePropertyInput(index)}
                      value={'' + (operationProperties.value || '')}
                    />
                </td>
                 <td>
                    <IconButton onClick={this.onDeletePropertyRow(index)}>
                        <ActionDelete />
                    </IconButton>
                </td>
            </tr>
        ));
    },
    render() {
        let { onChangeDate } = this;
        let { operation } = this.context.nomenclatures;
        let fields = this.state.fields;

        return (
            <div className={style.content}>
                { fields.operationId.visible &&
                    <div className={style.inputWrapper}>
                      <MultiSelectBubble
                        keyProp='operationIds'
                        name='operationIds'
                        label={fields.operationId.title}
                        value={this.props.data.operationIds}
                        options={operation || []}
                        onChange={(val) => { this.onSelectDropdown({ key: 'operationIds', value: val }); }}
                    />
                  </div>
                }
                { fields.operationStartDate.visible &&
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
                                  maxDate={this.props.data.operationEndDate ? new Date(this.props.data.operationEndDate) : undefined}
                                  minDate={new Date()}
                                />
                            </div>
                        </div>
                    </div>
                }
                { fields.operationEndDate.visible &&
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
