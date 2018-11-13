import React, { PropTypes } from 'react';
import style from '../../../style.css';
import Input from 'ut-front-react/components/Input';
import MoneyInput from 'ut-front-react/components/Input/MoneyInput';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import Range from './Range';
import plusImage from '../../../assets/add_new.png';
import {isNumber} from '../../../validations';

function stringifyNumber(n) {
    return isNumber(n) ? String(parseInt(n)) : null;
}

const Cumulative = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        splitIndex: PropTypes.number.isRequired,
        addSplitCumulativeRow: PropTypes.func.isRequired,
        deleteSplitCumulativeRow: PropTypes.func.isRequired,
        addSplitCumulativeRangeRow: PropTypes.func.isRequired,
        deleteSplitCumulativeRangeRow: PropTypes.func.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object
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
            self.context.onFieldChange('split.' + self.props.splitIndex + '.splitCumulative', index, field.key, stringifyNumber(field.value));
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
        const prop = data[index];

        return (
            <tr key={index}>
                <td>
                    <Input
                      keyProp='dailyCount'
                      onChange={this.onChangeInput(index)}
                      value={stringifyNumber(prop.dailyCount)}
                    />
                </td>
                <td>
                    <MoneyInput
                      keyProp='dailyAmount'
                      onChange={this.onChangeInput(index)}
                      value={stringifyNumber(prop.dailyAmount)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='weeklyCount'
                      onChange={this.onChangeInput(index)}
                      value={stringifyNumber(prop.weeklyCount)}
                    />
                </td>
                <td>
                    <MoneyInput
                      keyProp='weeklyAmount'
                      onChange={this.onChangeInput(index)}
                      value={stringifyNumber(prop.weeklyAmount)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='mounthlyCount'
                      onChange={this.onChangeInput(index)}
                      value={stringifyNumber(prop.mounthlyCount)}
                    />
                </td>
                <td>
                    <MoneyInput
                      keyProp='mounthlyAmount'
                      onChange={this.onChangeInput(index)}
                      value={stringifyNumber(prop.mounthlyAmount)}
                    />
                </td>
            </tr>
        );
    },
    createCumulativeStructure() {
        let {currency} = this.context.nomenclatures;
        return this.props.data && this.props.data.map((cumulative, index) => (
            <div key={index}>
                <div className={style.cumulative}>
                  <Dropdown
                    canSelectPlaceholder
                    keyProp='currency'
                    label={'Currency'}
                    data={currency || []}
                    onSelect={this.onSelectDropdown(index)}
                    defaultSelected={'' + (cumulative.currency || '')}
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
        ));
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
