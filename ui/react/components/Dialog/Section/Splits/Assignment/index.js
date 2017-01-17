import React, { PropTypes } from 'react';
import style from '../../../style.css';
import Input from 'ut-front-react/components/Input';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import plusImage from '../../../assets/add_new.png';

const Assignment = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        splitIndex: PropTypes.number.isRequired,
        addSplitAssignmentRow: PropTypes.func.isRequired,
        deleteSplitAssignmentRow: PropTypes.func.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object
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
            {name: 'Debit', key: 'debit'},
            {name: 'Credit', key: 'credit'},
            {name: '%', key: 'percent'},
            {name: 'Min Amount', key: 'minValue'},
            {name: 'Max Amount', key: 'maxValue'},
            {name: ' ', key: 'assignmentActions'}
        ].map((cell, i) => (
            <th key={i}>{cell.name}</th>
        ));
    },
    createAssignmentRows() {
        return this.props.data.map((splitAssignment, index) => (
            <tr key={index}>
                <td>
                    <Input
                      keyProp='description'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.description || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='debit'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.debit || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='credit'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.credit || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='percent'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.percent || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='minValue'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.minValue || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxValue'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitAssignment.maxValue || '')}
                    />
                </td>
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
                    Add another assignment
                </span>
            </div>
        );
    }
});

export default Assignment;
