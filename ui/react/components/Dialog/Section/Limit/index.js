import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import plusImage from '../../assets/add_new.png';

const SectionLimit = React.createClass({
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
            self.context.onFieldChange('limit', index, field.key, field.value);
        };
    },
    onChangeInput(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('limit', index, field.key, field.value);
        };
    },
    onDeleteRow(index) {
        let self = this;
        return () => {
            self.props.deleteRow(index);
        };
    },
    createLimitRows() {
        let nomenclatures = this.context.nomenclatures;
        return this.props.data.map((limit, index) => (
            <tr key={index}>
                <td>
                    <Dropdown
                      keyProp='currency'
                      data={nomenclatures.currency || []}
                      defaultSelected={'' + (limit.currency || '')}
                      onSelect={this.onSelectDropdown(index)}
                      mergeStyles={{dropDownRoot: style.dropDownRoot}}
                    />
                </td>
                <td>
                    <Input
                      keyProp='minAmount'
                      value={'' + (limit.minAmount || '')}
                      onChange={this.onChangeInput(index)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxAmount'
                      value={'' + (limit.maxAmount || '')}
                      onChange={this.onChangeInput(index)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxAmountDaily'
                      value={'' + (limit.maxAmountDaily || '')}
                      onChange={this.onChangeInput(index)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxCountDaily'
                      value={'' + (limit.maxCountDaily || '')}
                      onChange={this.onChangeInput(index)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxAmountWeekly'
                      value={'' + (limit.maxAmountWeekly || '')}
                      onChange={this.onChangeInput(index)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxCountWeekly'
                      value={'' + (limit.maxCountWeekly || '')}
                      onChange={this.onChangeInput(index)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxAmountMonthly'
                      value={'' + (limit.maxAmountMonthly || '')}
                      onChange={this.onChangeInput(index)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxCountMonthly'
                      value={'' + (limit.maxCountMonthly || '')}
                      onChange={this.onChangeInput(index)}
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
                            <th rowSpan={2} style={{ minWidth: '100px' }}>Currency</th>
                            <th colSpan={2}>Transactions</th>
                            <th colSpan={2}>Daily</th>
                            <th colSpan={2}>Weekly</th>
                            <th colSpan={2}>Monthly</th>
                            <th rowSpan={2}>&nbsp;</th>
                        </tr>
                        <tr>
                            <th>Max</th>
                            <th>Count</th>
                            <th>Max</th>
                            <th>Count</th>
                            <th>Max</th>
                            <th>Count</th>
                            <th>Max</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.createLimitRows()}
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

export default SectionLimit;
