import React, { PropTypes } from 'react';
import style from '../../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import Checkbox from 'ut-front-react/components/Input/Checkbox';
import plusImage from '../../../assets/add_new.png';

const Range = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        splitIndex: PropTypes.number.isRequired,
        addSplitRangeRow: PropTypes.func.isRequired,
        deleteSplitRangeRow: PropTypes.func.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object
    },
    onSelectDropdown(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('split.' + self.props.splitIndex + '.splitRange', index, field.key, field.value);
        };
    },
    onChangeInput(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('split.' + self.props.splitIndex + '.splitRange', index, field.key, field.value);
        };
    },
    onCheckboxCheck(index, splitRange) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('split.' + self.props.splitIndex + '.splitRange', index, 'isSourceAmount', !splitRange.isSourceAmount);
        };
    },
    onDeleteRow(index) {
        let self = this;
        return () => {
            self.props.deleteSplitRangeRow(self.props.splitIndex, index);
        };
    },
    createHeaderCells() {
        return [
            {name: 'Start Amount', key: 'startAmount'},
            {name: 'Currency', key: 'startAmountCurrency'},
            {name: '%', key: 'percent'},
            {name: 'Min Amount', key: 'minValue'},
            {name: 'Max Amount', key: 'maxValue'},
            {name: 'isSourceAmount', key: 'isSourceAmount'},
            {name: ' ', key: 'rangeActions'}
        ].map((cell, i) => (
            <th key={i}>{cell.name}</th>
        ));
    },
    createRangeRows() {
        let nomenclatures = this.context.nomenclatures;
        return this.props.data.map((splitRange, index) => (
            <tr key={index}>
                <td>
                    <Input
                      keyProp='startAmount'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitRange.startAmount || '')}
                    />
                </td>
                <td style={{minWidth: '100px'}}>
                    <Dropdown
                      keyProp='startAmountCurrency'
                      data={nomenclatures.currency || []}
                      onSelect={this.onSelectDropdown(index)}
                      defaultSelected={'' + (splitRange.startAmountCurrency || '')}
                      mergeStyles={{dropDownRoot: style.dropDownRoot}}
                    />
                </td>
                <td>
                    <Input
                      keyProp='percent'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitRange.percent || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='minValue'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitRange.minValue || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxValue'
                      onChange={this.onChangeInput(index)}
                      value={'' + (splitRange.maxValue || '')}
                    />
                </td>
                <td style={{textAlign: 'center'}}>
                    <Checkbox
                      onClick={this.onCheckboxCheck(index, splitRange)}
                      checked={splitRange.isSourceAmount}
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
                        {this.createRangeRows()}
                    </tbody>
                </table>
                <span className={style.link} onClick={this.props.addSplitRangeRow(this.props.splitIndex)}>
                    <img src={plusImage} className={style.plus} />
                    Add another range
                </span>
            </div>
        );
    }
});

export default Range;
