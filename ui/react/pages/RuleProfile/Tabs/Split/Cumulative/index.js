import React, { PropTypes } from 'react';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import Button from 'ut-front-react/components/StandardButton';
import { fromJS } from 'immutable';
import classnames from 'classnames';
import {validations} from '../../../validator';
import style from '../../style.css';

export const Cumulative = (props) => {
    const {
        canEdit,
        addCumulative,
        removeCumulative,
        setCumulativeField,
        addCumulativeRange,
        removeCumulativeRange,
        cumulatives,
        setCumulativeRangeField,
        currencies,
        splitIndex,
        errors // immutable
    } = props;
    let readonly = !canEdit;
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

    const getBody = (idx) => {
        let cumulative = cumulatives[idx] || {};
        return (
            <tr className={style.rangeRow} key={`cumulative${idx}`}>
                <td>
                    <Input
                      readonly={readonly}
                      keyProp='dailyCount'
                      validators={validations.count}
                      isValid={!errors.getIn([idx, 'dailyCount'])}
                      errorMessage={errors.getIn([idx, 'dailyCount'])}
                      value={cumulative.dailyCount}
                      onChange={(field) => { setCumulativeField(field, idx); }}
                    />
                </td>
                <td>
                    <Input
                      readonly={readonly}
                      keyProp='dailyAmount'
                      validators={validations.amount}
                      isValid={!errors.getIn([idx, 'dailyAmount'])}
                      errorMessage={errors.getIn([idx, 'dailyAmount'])}
                      value={cumulative.dailyAmount}
                      onChange={(field) => { setCumulativeField(field, idx); }}
                    />
                </td>
                <td>
                    <Input
                      readonly={readonly}
                      keyProp='weeklyCount'
                      validators={validations.count}
                      isValid={!errors.getIn([idx, 'weeklyCount'])}
                      errorMessage={errors.getIn([idx, 'weeklyCount'])}
                      value={cumulative.weeklyCount}
                      onChange={(field) => { setCumulativeField(field, idx); }}
                    />
                </td>
                <td>
                    <Input
                      readonly={readonly}
                      keyProp='weeklyAmount'
                      validators={validations.amount}
                      isValid={!errors.getIn([idx, 'weeklyAmount'])}
                      errorMessage={errors.getIn([idx, 'weeklyAmount'])}
                      value={cumulative.weeklyAmount}
                      onChange={(field) => { setCumulativeField(field, idx); }}
                    />
                </td>
                <td>
                    <Input
                      readonly={readonly}
                      keyProp='monthlyCount'
                      validators={validations.count}
                      isValid={!errors.getIn([idx, 'monthlyCount'])}
                      errorMessage={errors.getIn([idx, 'monthlyCount'])}
                      value={cumulative.monthlyCount}
                      onChange={(field) => { setCumulativeField(field, idx); }}
                    />
                </td>
                <td>
                    <Input
                      readonly={readonly}
                      inputWrapClassName={style.inputWrapper}
                      value={cumulative.monthlyAmount}
                      validators={validations.amount}
                      isValid={!errors.getIn([idx, 'monthlyAmount'])}
                      errorMessage={errors.getIn([idx, 'monthlyAmount'])}
                      keyProp='monthlyAmount'
                      onChange={(field) => { setCumulativeField(field, idx); }}
                    />
                </td>
            </tr>
        );
    };

    const getRangeBody = (cumulativeId) => {
        if (cumulatives[cumulativeId] && cumulatives[cumulativeId].ranges) {
            let showDeleteIcon = cumulatives[cumulativeId].ranges.length !== 1;
            return cumulatives[cumulativeId].ranges.map((range, index) => {
                let ridx = index.toString();
                let rerrors = errors.getIn([cumulativeId, 'ranges', ridx]) || fromJS({});
                return (
                <tr key={`range${index}`}>
                    <td>
                        <Input
                          readonly={readonly}
                          keyProp='startAmount'
                          validators={validations.amount}
                          isValid={!rerrors.getIn(['startAmount'])}
                          errorMessage={rerrors.getIn(['startAmount'])}
                          value={range.startAmount}
                          onChange={(field) => { setCumulativeRangeField(cumulativeId, index, field); }}
                        />
                    </td>
                    <td>
                        <Input
                          readonly={readonly}
                          keyProp='percent'
                          validators={validations.percent}
                          isValid={!rerrors.getIn(['percent'])}
                          errorMessage={rerrors.getIn(['percent'])}
                          value={range.percent}
                          onChange={(field) => { setCumulativeRangeField(cumulativeId, index, field); }}
                        />
                    </td>
                    <td>
                        <Input
                          readonly={readonly}
                          keyProp='minAmount'
                          validators={validations.amount}
                          isValid={!rerrors.getIn(['minAmount'])}
                          errorMessage={rerrors.getIn(['minAmount'])}
                          value={range.minAmount}
                          onChange={(field) => { setCumulativeRangeField(cumulativeId, index, field); }}
                        />
                    </td>
                    <td>
                        <Input
                          readonly={readonly}
                          keyProp='maxAmount'
                          validators={validations.amount}
                          isValid={!rerrors.getIn(['maxAmount'])}
                          errorMessage={rerrors.getIn(['maxAmount'])}
                          value={range.maxAmount}
                          onChange={(field) => { setCumulativeRangeField(cumulativeId, index, field); }}
                        />
                    </td>
                    <td className={style.deleteCol}>
                        { canEdit && showDeleteIcon && <div className={style.deleteIcon} onClick={() => { removeCumulativeRange(splitIndex, 0, index); }} /> }
                    </td>
                </tr>);
            });
        }
    };
    let cumulativeElements = (cumulatives || []).map((cumulative, idx) => {
        return (
            <div className={classnames(style.propertyTable, style.cumulativeContainer)} key={`cumulativeElement${idx}`}>
                <div>
                    { canEdit && <Button onClick={() => removeCumulative(splitIndex, idx)} className={classnames(style.deleteButton, style.deleteCumulative)} styleType='secondaryLight' label='DELETE CUMULATIVE' /> }
                </div>
                <div className={style.dropDownWrapper}>
                    <Dropdown
                      disabled={readonly}
                      keyProp={'currency'}
                      isValid={!errors.getIn([idx, 'currency'])}
                      errorMessage={errors.getIn([idx, 'currency'])}
                      canSelectPlaceholder
                      data={currencies}
                      defaultSelected={cumulative.currency}
                      placeholder='Currency'
                      onSelect={(field) => { setCumulativeField(field, idx); }}
                      label={'Currency'}
                    />
                </div>
                <table className={style.dataGridTable}>
                    <thead>
                        <tr>
                            {getHeaderCells()}
                        </tr>
                    </thead>
                    <tbody >
                        {getBody(idx)}
                    </tbody>
                </table>
                <div className={style.rangeWrapper}>
                    <TitledContentBox title='Range' >
                        <div className={style.rangeInnerWrapper}>
                            <table className={style.dataGridTable}>
                            <thead>
                                <tr>
                                    {getRangeCells()}
                                </tr>
                            </thead>
                            <tbody>
                                {getRangeBody(idx)}
                            </tbody>
                        </table>
                        { canEdit && <span className={style.link} onClick={() => addCumulativeRange(splitIndex, idx)}>
                            <div className={style.plus} />
                            Add another Range
                        </span> }
                        </div>
                    </TitledContentBox>
                </div>
            </div>
        );
    });
    return (<div>
        {cumulativeElements}
        { canEdit && <span className={style.link} onClick={() => addCumulative(splitIndex)}>
            <div className={style.plus} />
                Add Cumulative
        </span> }
    </div>);
};

Cumulative.propTypes = {
    canEdit: PropTypes.bool,
    setCumulativeField: PropTypes.func,
    addCumulativeRange: PropTypes.func,
    removeCumulativeRange: PropTypes.func,
    setCumulativeRangeField: PropTypes.func,
    cumulatives: PropTypes.array,
    currencies: PropTypes.array,
    splitIndex: PropTypes.number,
    cumulativeId: PropTypes.number,
    addCumulative: PropTypes.func,
    removeCumulative: PropTypes.func,
    errors: PropTypes.object // immutable
};

Cumulative.defaultProps = {
    canEdit: true,
    cumulativeId: 0,
    errors: fromJS({})
};

export default Cumulative;
