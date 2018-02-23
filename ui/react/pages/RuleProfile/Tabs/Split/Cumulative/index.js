import React, { PropTypes } from 'react';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import classnames from 'classnames';

import style from '../../style.css';
// import plusImage from '../assets/add_new.png';
// import deleteImage from '../assets/delete.png';

export const Cumulative = (props) => {
    const {
        setCumulativeField,
        addCumulativeRange,
        removeCumulativeRange,
        cumulatives,
        setCumulativeRangeField,
        currencies,
        splitIndex
    } = props;

    const getHeaderCells = () => {
        return [
            {name: 'Daily Count', key: 'dailyCount'},
            {name: 'Daily Amount', key: 'dailyAmount'},
            {name: 'Weekly Count', key: 'weeklyCount'},
            {name: 'Weekly Amount', key: 'weeklyAmount'},
            {name: 'Monthly Count', key: 'monthlyCount'},
            {name: 'Monthly Amount', key: 'monthlyAmount'}
        ].map((cell, i) => (
            <th key={i} className={cell.className || ''}>{cell.name}</th>
        ));
    };

    const getRangeCells = () => {
        return [
            {name: 'Start Amount', key: 'startAmount'},
            {name: '%', key: 'precent'},
            {name: 'Min Amount', key: 'minAmount'},
            {name: 'Max Amount', key: 'maxAmount'},
            {name: '', key: 'rangeActions', className: style.deleteCol}
        ].map((cell, i) => (
            <th key={i} className={cell.className || ''}>{cell.name}</th>
        ));
    };

    const getBody = () => {
        return (
            <tr key={`cumulative${1}`}>
                <td>
                    <Input
                      keyProp='dailyCount'
                      value={cumulatives[0].dailyCount}
                      onChange={({key, value}) => { setCumulativeField(splitIndex, 0, key, value); }}
                    />
                </td>
                <td>
                    <Input
                      keyProp='dailyAmount'
                      value={cumulatives[0].dailyAmount}
                      onChange={({key, value}) => { setCumulativeField(splitIndex, 0, key, value); }}
                    />
                </td>
                <td>
                    <Input
                      keyProp='weeklyCount'
                      value={cumulatives[0].weeklyCount}
                      onChange={({key, value}) => { setCumulativeField(splitIndex, 0, key, value); }}
                    />
                </td>
                <td>
                    <Input
                      keyProp='weeklyAmount'
                      value={cumulatives[0].weeklyAmount}
                      onChange={({key, value}) => { setCumulativeField(splitIndex, 0, key, value); }}
                    />
                </td>
                <td>
                    <Input
                      keyProp='monthlyCount'
                      value={cumulatives[0].monthlyCount}
                      onChange={({key, value}) => { setCumulativeField(splitIndex, 0, key, value); }}
                    />
                </td>
                <td>
                    <Input
                      inputWrapClassName={style.inputWrapper}
                      value={cumulatives[0].monthlyAmount}
                      keyProp='monthlyAmount'
                      onChange={({key, value}) => { setCumulativeField(splitIndex, 0, key, value); }}
                    />
                </td>
            </tr>
        );
    };

    const getRangeBody = (cumulativeId) => {
        if (cumulatives[cumulativeId] && cumulatives[cumulativeId].ranges) {
            return cumulatives[cumulativeId].ranges.map((range, index) => (
                <tr key={`range${index}`}>
                    <td>
                        <Input
                          keyProp='startAmount'
                          value={range.startAmount}
                          onChange={({key, value}) => { setCumulativeRangeField(splitIndex, 0, index, key, value); }}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='percent'
                          value={range.percent}
                          onChange={({key, value}) => { setCumulativeRangeField(splitIndex, 0, index, key, value); }}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='minAmount'
                          value={range.minAmount}
                          onChange={({key, value}) => { setCumulativeRangeField(splitIndex, 0, index, key, value); }}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='maxAmount'
                          value={range.maxAmount}
                          onChange={({key, value}) => { setCumulativeRangeField(splitIndex, 0, index, key, value); }}
                        />
                    </td>
                    <td className={style.deleteCol}>
                        <div className={style.deleteIcon} onClick={() => { removeCumulativeRange(splitIndex, 0, index); }} />
                    </td>
                </tr>
            ));
        }
    };
    return (
        <div className={style.propertyTable}>
             <div className={style.dropDownWrapper}>
                <Dropdown
                  canSelectPlaceholder
                  data={currencies}
                  defaultSelected={cumulatives[0].currency}
                  placeholder='Currency'
                  onSelect={({value}) => { setCumulativeField(splitIndex, 0, 'currency', value); }}
                  label={'Currency'}
                />
            </div>
            <table className={classnames(style.dataGridTable, classnames)}>
                <thead>
                    <tr>
                        {getHeaderCells()}
                    </tr>
                </thead>
                <tbody >
                    {getBody()}
                </tbody>
            </table>
            <div className={style.rangeWrapper}>
                <TitledContentBox
                  title='Range'
                >
                    <div className={style.rangeInnerWrapper}>
                        <table className={style.dataGridTable}>
                        <thead>
                            <tr>
                                {getRangeCells()}
                            </tr>
                        </thead>
                        <tbody >
                            {getRangeBody(0)}
                        </tbody>
                    </table>
                    <span className={style.link} onClick={() => addCumulativeRange(splitIndex, 0)}>
                        <div className={style.plus} />
                        Add another Range
                    </span>
                    </div>
                </TitledContentBox>
            </div>
        </div>
    );
};

Cumulative.propTypes = {
    setCumulativeField: PropTypes.func,
    addCumulativeRange: PropTypes.func,
    removeCumulativeRange: PropTypes.func,
    setCumulativeRangeField: PropTypes.func,
    cumulatives: PropTypes.array,
    currencies: PropTypes.array,
    splitIndex: PropTypes.number
};

export default Cumulative;
