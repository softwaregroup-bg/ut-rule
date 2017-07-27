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
        channelData: PropTypes.any,
        addRow: PropTypes.func.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object,
        currencyOrganization: PropTypes.object
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
        let currencies = this.context.nomenclatures.currency;
        let currencyOrganization = this.context.currencyOrganization;
        let chosenOrganizationId = this.props.channelData && this.props.channelData.channelOrganizationId ? this.props.channelData.channelOrganizationId : null;

        if (chosenOrganizationId) {
            currencies = currencyOrganization.map(c => {
                if (c.organizationId === chosenOrganizationId) {
                    return {
                        key: c.value,
                        name: c.display
                    };
                }
            }).filter(Boolean);
        }

        return this.props.data.map((limit, index) => {
            var currencyTwo = limit.currency;
            var firstCurrencyKey = chosenOrganizationId ? (currencies && currencies[0] && currencies[0].key) : undefined;
            var defaultCurrency = [firstCurrencyKey, currencyTwo].find(dk => {
                return currencies.find(curDK => curDK.key === dk);
            });

            return (
                <tr key={index}>
                    <td>
                        <Dropdown
                          keyProp='currency'
                          data={currencies || []}
                          defaultSelected={'' + (defaultCurrency)}
                          onSelect={this.onSelectDropdown(index)}
                          mergeStyles={{ dropDownRoot: style.dropDownRoot }}
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
            );
        });
    },
    render() {
        return (
            <div>
                <table className={style.dataGridTable}>
                    <thead>
                        <tr>
                            <th rowSpan={2} style={{ minWidth: '100px' }}>Currency</th>
                            <th colSpan={2}>Transaction Amount</th>
                            <th colSpan={2}>Daily</th>
                            <th colSpan={2}>Weekly</th>
                            <th colSpan={2}>Monthly</th>
                            <th rowSpan={2}>&nbsp;</th>
                        </tr>
                        <tr>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Max Amount</th>
                            <th>Max Count</th>
                            <th>Max Amount</th>
                            <th>Max Count</th>
                            <th>Max Amount</th>
                            <th>Max Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.createLimitRows()}
                    </tbody>
                </table>
                {(this.props.data.length === 0) && <span className={style.link} onClick={this.props.addRow}>
                    <img src={plusImage} className={style.plus} />
                    Add another limit
                </span>}
            </div>
        );
    }
});

export default SectionLimit;
