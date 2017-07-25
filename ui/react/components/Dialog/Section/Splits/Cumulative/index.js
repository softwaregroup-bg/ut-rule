import React, { PropTypes } from 'react';
import style from '../../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import Range from './Range';
import plusImage from '../../../assets/add_new.png';

const Cumulative = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        splitIndex: PropTypes.number.isRequired,
        addSplitCumulativeRow: PropTypes.func.isRequired,
        deleteSplitCumulativeRow: PropTypes.func.isRequired,
        addSplitCumulativeRangeRow: PropTypes.func.isRequired,
        channelData: PropTypes.any,
        deleteSplitCumulativeRangeRow: PropTypes.func.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object,
        currencyOrganization: PropTypes.object
    },
    onSelectDropdown(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('split.' + self.props.splitIndex + '.splitCumulative', index, field.key, field.value);
        };
    },
    onChangeInput(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('split.' + self.props.splitIndex + '.splitCumulative', index, field.key, parseInt(field.value));
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
            {name: 'Daily Count', key: 'dailyCount'},
            {name: 'Daily Amount', key: 'dailyAmount'},
            {name: 'Weekly Count', key: 'weeklyCount'},
            {name: 'Weekly Amount', key: 'weeklyAmount'},
            {name: 'Monthly Count', key: 'mounthlyCount'},
            {name: 'Monthly Amount', key: 'mounthlyAmount'}
        ].map((cell, i) => (
            <th key={i}>{cell.name}</th>
        ));
    },
    createCumulativeRows(index) {
        let {data} = this.props;
        return (
            <tr key={index}>
                <td>
                    <Input
                      type='number'
                      keyProp='dailyCount'
                      onChange={this.onChangeInput(index)}
                      value={'' + (data[index].dailyCount || '')}
                    />
                </td>
                <td>
                    <Input
                      type='number'
                      keyProp='dailyAmount'
                      onChange={this.onChangeInput(index)}
                      value={'' + (data[index].dailyAmount || '')}
                    />
                </td>
                <td>
                    <Input
                      type='number'
                      keyProp='weeklyCount'
                      onChange={this.onChangeInput(index)}
                      value={'' + (data[index].weeklyCount || '')}
                    />
                </td>
                <td>
                    <Input
                      type='number'
                      keyProp='weeklyAmount'
                      onChange={this.onChangeInput(index)}
                      value={'' + (data[index].weeklyAmount || '')}
                    />
                </td>
                <td>
                    <Input
                      type='number'
                      keyProp='mounthlyCount'
                      onChange={this.onChangeInput(index)}
                      value={'' + (data[index].mounthlyCount || '')}
                    />
                </td>
                <td>
                    <Input
                      type='number'
                      keyProp='mounthlyAmount'
                      onChange={this.onChangeInput(index)}
                      value={'' + (data[index].mounthlyAmount || '')}
                    />
                </td>
            </tr>
        );
    },
    createCumulativeStructure() {
        let {currency} = this.context.nomenclatures;

        let currenciesToUse = currency;
        let currencyOrganization = this.context.currencyOrganization;
        let chosenOrganizationId = this.props.channelData && this.props.channelData.channelOrganizationId ? this.props.channelData.channelOrganizationId : null;

        if (chosenOrganizationId) {
            currenciesToUse = currencyOrganization.map(c => {
                if (c.organizationId === chosenOrganizationId) {
                    return {
                        key: c.value,
                        name: c.display
                    };
                }
            }).filter(Boolean);
        }

        return this.props.data && this.props.data.map((cumulative, index) => {
            let firstCurrencyKey = chosenOrganizationId ? (currenciesToUse && currenciesToUse[0] && currenciesToUse[0].key) : undefined;
            let defaultCurrency = [firstCurrencyKey, cumulative.currency].find(dk => {
                return currency.find(curDK => curDK.key === dk);
            });

            return (
                <div key={index}>
                    <div className={style.cumulative}>
                    <Dropdown
                      canSelectPlaceholder
                      keyProp='currency'
                      label={'Currency'}
                      data={currenciesToUse || []}
                      onSelect={this.onSelectDropdown(index)}
                      defaultSelected={'' + (defaultCurrency || '')}
                      mergeStyles={{dropDownRoot: style.dropDownRoot}}
                    />
                    </div>
                    <div className={style.cumulative}>
                    <table className={style.dataGridTable}>
                        <thead>
                            <tr>
                                {this.createHeaderCells()}
                            </tr>
                        </thead>
                        <tbody className={style.limitTableBody}>
                            {this.createCumulativeRows(index)}
                        </tbody>
                    </table>
                    </div>
                    <Range
                      data={cumulative.splitRange}
                      splitIndex={this.props.splitIndex}
                      cumulativeIndex={index}
                      addSplitRangeRow={this.props.addSplitCumulativeRangeRow}
                      deleteSplitRangeRow={this.props.deleteSplitCumulativeRangeRow}
                    />
                    <button className={style.statusActionButton} onClick={this.props.deleteSplitCumulativeRow(this.props.splitIndex, index)}>
                        Delete this Cumulative
                    </button>
                    <hr />
                </div>
            );
        });
    },
    render() {
        return (
            <div>
              {this.createCumulativeStructure()}
              <span className={style.link} onClick={(this.props.addSplitCumulativeRow(this.props.splitIndex))}>
                  <img src={plusImage} className={style.plus} />
                  Add cumulative
              </span>
            </div>
        );
    }
});

export default Cumulative;
