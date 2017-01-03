import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import plusImage from '../../assets/add_new.png';

const SectionCommission = React.createClass({
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
            self.context.onFieldChange('commission', index, field.key, field.value);
        };
    },
    onChangeInput(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('commission', index, field.key, field.value);
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
            {name: 'Currency', key: 'commissionCurrency'},
            {name: '%', key: 'commissionPercent'},
            {name: '% Base', key: 'commissionPercentBase'},
            {name: 'Min Amount', key: 'commissionMinAmount'},
            {name: 'Max Amount', key: 'commissionMaxAmount'},
            {name: ' ', key: 'commissionActions'}
        ].map((cell, i) => (
            <th key={i}>{cell.name}</th>
        ));
    },
    createCommissionRows() {
        let nomenclatures = this.context.nomenclatures;
        return this.props.data.map((commission, index) => (
            <tr key={index}>
                <td>
                    <Input
                      keyProp='startAmount'
                      onChange={this.onChangeInput(index)}
                      value={'' + (commission.startAmount || '')}
                    />
                </td>
                <td style={{minWidth: '100px'}}>
                    <Dropdown
                      keyProp='startAmountCurrency'
                      data={nomenclatures.Currency || []}
                      onSelect={this.onSelectDropdown(index)}
                      defaultSelected={'' + (commission.startAmountCurrency || '')}
                      mergeStyles={{dropDownRoot: style.dropDownRoot}}
                    />
                </td>
                <td>
                    <Input
                      keyProp='percent'
                      onChange={this.onChangeInput(index)}
                      value={'' + (commission.percent || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='percentBase'
                      onChange={this.onChangeInput(index)}
                      value={'' + (commission.percentBase || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='minValue'
                      onChange={this.onChangeInput(index)}
                      value={'' + (commission.minValue || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxValue'
                      onChange={this.onChangeInput(index)}
                      value={'' + (commission.maxValue || '')}
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
                        {this.createCommissionRows()}
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

export default SectionCommission;
