import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const SectionLimit = React.createClass({
    propTypes: {
        nomenclatures: PropTypes.object.isRequired,
        data: PropTypes.array.isRequired,
        addLimitRow: PropTypes.func.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func
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
    createLimitRows() {
        return this.props.data.map((limit, index) => (
            <tr key={index}>
                <td>
                    <Dropdown
                      keyProp='currency'
                      data={this.props.nomenclatures.country}
                      defaultSelected={'' + (limit.currency || '')}
                      onSelect={this.onSelectDropdown(index)}
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
                    <IconButton>
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
                            <th>Min</th>
                            <th>Max</th>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Min</th>
                            <th>Max</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.createLimitRows()}
                    </tbody>
                </table>
                <button type='button' onClick={this.props.addLimitRow}>Add another limit</button>
            </div>
        );
    }
});

export default SectionLimit;
