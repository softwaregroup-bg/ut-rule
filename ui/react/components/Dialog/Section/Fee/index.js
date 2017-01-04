import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import plusImage from '../../assets/add_new.png';

const SectionFee = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        addRow: PropTypes.func.isRequired,
        deleteRow: PropTypes.func.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object
    },
    onSelectDropdown(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('fee', index, field.key, field.value);
        };
    },
    onChangeInput(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('fee', index, field.key, field.value);
        };
    },
    onDeleteRow(index) {
        let self = this;
        return () => {
            self.props.deleteRow(index);
        };
    },
    createHeaderCells() {
        return [
            {name: 'Start Amount', key: 'startAmount'},
            {name: 'Currency', key: 'feeCurrency'},
            {name: '%', key: 'feePercent'},
            {name: '% Base', key: 'feePercentBase'},
            {name: 'Min Amount', key: 'feeMinAmount'},
            {name: 'Max Amount', key: 'feeMaxAmount'},
            {name: ' ', key: 'feeActions'}
        ].map((cell, i) => (
            <th key={i}>{cell.name}</th>
        ));
    },
    createFeeRows() {
        let nomenclatures = this.context.nomenclatures;
        return this.props.data.map((fee, index) => (
            <tr key={index}>
                <td>
                    <Input
                      keyProp='startAmount'
                      onChange={this.onChangeInput(index)}
                      value={'' + (fee.startAmount || '')}
                    />
                </td>
                <td style={{minWidth: '100px'}}>
                    <Dropdown
                      keyProp='startAmountCurrency'
                      data={nomenclatures.currency || []}
                      onSelect={this.onSelectDropdown(index)}
                      defaultSelected={'' + (fee.startAmountCurrency || '')}
                      mergeStyles={{dropDownRoot: style.dropDownRoot}}
                    />
                </td>
                <td>
                    <Input
                      keyProp='percent'
                      onChange={this.onChangeInput(index)}
                      value={'' + (fee.percent || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='percentBase'
                      onChange={this.onChangeInput(index)}
                      value={'' + (fee.percentBase || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='minValue'
                      onChange={this.onChangeInput(index)}
                      value={'' + (fee.minValue || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxValue'
                      onChange={this.onChangeInput(index)}
                      value={'' + (fee.maxValue || '')}
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
                        {this.createFeeRows()}
                    </tbody>
                </table>
                <span className={style.link} onClick={this.props.addRow}>
                    <img src={plusImage} className={style.plus} />
                    Add another commission
                </span>
            </div>
        );
    }
});

export default SectionFee;
