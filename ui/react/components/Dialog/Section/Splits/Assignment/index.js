import React, { PropTypes } from 'react';
import style from '../../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import plusImage from '../../../assets/add_new.png';

const Assignment = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        splitIndex: PropTypes.number.isRequired,
        addSplitAssignmentRow: PropTypes.func.isRequired,
        deleteSplitAssignmentRow: PropTypes.func.isRequired,
        fields: PropTypes.object,
        nomenclatures: PropTypes.object
    },
    contextTypes: {
        onFieldChange: PropTypes.func
    },
    getInitialState() {
        return {
            fields: this.props.fields
        };
    },
    onSelectDropdown(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('split.' + self.props.splitIndex + '.splitAssignment', index, field.key, field.value);
        };
    },
    onChangeInput(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('split.' + self.props.splitIndex + '.splitAssignment', index, field.key, field.value);
        };
    },
    onDeleteRow(index) {
        let self = this;
        return () => {
            self.props.deleteSplitAssignmentRow(self.props.splitIndex, index);
        };
    },
    createHeaderCells() {
        return [
            {name: 'Description', key: 'description'},
            {name: 'Debit', key: 'debitAlias'},
            {name: 'Debit', key: 'debit'},
            {name: 'Credit', key: 'creditAlias'},
            {name: 'Credit', key: 'credit'},
            {name: '%', key: 'percent'},
            {name: 'Min Amount', key: 'minValue'},
            {name: 'Max Amount', key: 'maxValue'},
            {name: ' ', key: 'assignmentActions'}
        ].filter((column) => (!this.state.fields[column.key] || this.state.fields[column.key].visible)).map((cell, i) => (
            <th key={i}>{cell.name}</th>
        ));
    },
    createAssignmentRows() {
        let fields = this.state.fields;
        let {alias, creditAlias, debitAlias} = this.props.nomenclatures;

        return this.props.data.map((splitAssignment, index) => (
            <tr key={index}>
                {fields.description.visible &&
                <td>
                    <Input
                      keyProp='description'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.description || '')}
                    />
                </td>
                }
                {fields.debit.visible &&
                <td>
                    <Input
                      keyProp='debit'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.debit || '')}
                    />
                </td>
                }
                {fields.debitAlias.visible && debitAlias &&
                <td style={{minWidth: '200px'}}>
                    <Dropdown
                      keyProp='debit'
                      data={debitAlias}
                      onSelect={this.onSelectDropdown(index)}
                      defaultSelected={'' + (splitAssignment.debit || '')}
                      mergeStyles={{dropDownRoot: style.dropDownRoot}}
                    />
                </td>
                }
                {fields.credit.visible &&
                <td>
                    <Input
                      keyProp='credit'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.credit || '')}
                    />
                </td>
                }
                {fields.creditAlias.visible && creditAlias &&
                <td style={{minWidth: '200px'}}>
                    <Dropdown
                      keyProp='credit'
                      data={creditAlias}
                      onSelect={this.onSelectDropdown(index)}
                      defaultSelected={'' + (splitAssignment.credit || '')}
                      mergeStyles={{dropDownRoot: style.dropDownRoot}}
                    />
                </td>
                }
                {fields.percent.visible &&
                <td className={style.splitMinWidth}>
                    <Input
                      keyProp='percent'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.percent || '')}
                    />
                </td>
                }
                {fields.minValue.visible &&
                <td>
                    <Input
                      keyProp='minValue'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.minValue || '')}
                    />
                </td>
                }
                {fields.maxValue.visible &&
                <td>
                    <Input
                      keyProp='maxValue'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.maxValue || '')}
                    />
                </td>
                }
                <td>
                    <IconButton onClick={this.onDeleteRow(index)}>
                        <ActionDelete />
                    </IconButton>
                </td>
            </tr>
        ));
    },
    render() {
        return (
            <div>
                <table className={style.dataGridTable}>
                    <thead>
                        <tr>
                            {this.createHeaderCells()}
                        </tr>
                    </thead>
                    <tbody className={style.limitTableBody}>
                        {this.createAssignmentRows()}
                    </tbody>
                </table>
                <span className={style.link} onClick={this.props.addSplitAssignmentRow(this.props.splitIndex)}>
                    <img src={plusImage} className={style.plus} />
                    Add assignment
                </span>
            </div>
        );
    }
});

export default Assignment;
