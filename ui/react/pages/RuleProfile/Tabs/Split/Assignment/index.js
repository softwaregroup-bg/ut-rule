import React, { PropTypes } from 'react';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import {validations} from '../../../validator';
import style from '../../style.css';
import { fromJS } from 'immutable';

export const Assignment = (props) => {
    const {
        canEdit,
        addAssignment,
        removeAssignment,
        changeInput,
        assignments,
        splitIndex,
        errors // immutable
    } = props;
    const readonly = !canEdit;
    const getHeaderCells = () => {
        return [
            {name: 'Description', key: 'description'},
            {name: 'Debit', key: 'debit'},
            {name: 'Credit', key: 'credit'},
            {name: '%', key: 'percent'},
            {name: 'Min Amount', key: 'minAmount'},
            {name: 'Max Amount', key: 'maxAmount'},
            {name: '', key: 'rangeActions', className: style.deleteCol}
        ].map((cell, i) => (
            <th key={i} className={cell.className || ''}>{cell.name}</th>
        ));
    };
    const dropDownData = [
        {key: '01', name: 'Agent Float Account'},
        {key: '02', name: 'Bank Fee Account'},
        {key: '03', name: 'Customer Account'}
    ];

    const getBody = () => {
        return assignments.map((prop, index) => {
            const idx = index.toString();
            return (
                <tr key={`${index}`}>
                    <td>
                        <Input
                            readonly={readonly}
                            keyProp='description'
                            onChange={(field) => { changeInput(index, field); }}
                            isValid={!errors.getIn([idx, 'description'])}
                            errorMessage={errors.getIn([idx, 'description'])}
                            value={prop.description}
                        />
                    </td>
                    {/* <td>
                        <Input
                            readonly={readonly}
                            keyProp='debit'
                            isValid={!errors.getIn([idx, 'debit'])}
                            errorMessage={errors.getIn([idx, 'debit'])}
                            onChange={(field) => { changeInput(index, field); }}
                            value={prop.debit}
                        />
                    </td> */}
                    <td>
                        <Dropdown
                            disabled={readonly}
                            canSelectPlaceholder
                            keyProp='debit'
                            data={dropDownData}
                            defaultSelected={prop.debit}
                            placeholder='Select Account'
                            onSelect={(field) => { changeInput(index, field); }}
                            // label={'Debit'}
                            isValid={!errors.getIn([idx, 'debit'])}
                            errorMessage={errors.getIn([idx, 'debit'])}
                        />
                    </td>
                    <td>
                        <Dropdown
                            disabled={readonly}
                            canSelectPlaceholder
                            keyProp='credit'
                            data={dropDownData}
                            defaultSelected={prop.credit}
                            placeholder='Select Account'
                            onSelect={(field) => { changeInput(index, field); }}
                            // label={'Credit'}
                            isValid={!errors.getIn([idx, 'credit'])}
                            errorMessage={errors.getIn([idx, 'credit'])}
                        />
                    </td>
                    {/* <td>
                        <Input
                            readonly={readonly}
                            keyProp='credit'
                            isValid={!errors.getIn([idx, 'credit'])}
                            errorMessage={errors.getIn([idx, 'credit'])}
                            onChange={(field) => { changeInput(index, field); }}
                            value={prop.credit}
                        />
                    </td> */}
                    <td>
                        <Input
                            readonly={readonly}
                            keyProp='percent'
                            validators={validations.percent}
                            isValid={!errors.getIn([idx, 'percent'])}
                            errorMessage={errors.getIn([idx, 'percent'])}
                            onChange={(field) => { changeInput(index, field); }}
                            value={prop.percent}
                        />
                    </td>
                    <td>
                        <Input
                            readonly={readonly}
                            keyProp='minAmount'
                            validators={validations.amount}
                            isValid={!errors.getIn([idx, 'minAmount'])}
                            errorMessage={errors.getIn([idx, 'minAmount'])}
                            onChange={(field) => { changeInput(index, field); }}
                            value={prop.minAmount}
                        />
                    </td>
                    <td>
                        <Input
                            readonly={readonly}
                            keyProp='maxAmount'
                            validators={validations.amount}
                            isValid={!errors.getIn([idx, 'maxAmount'])}
                            errorMessage={errors.getIn([idx, 'maxAmount'])}
                            onChange={(field) => { changeInput(index, field); }}
                            value={prop.maxAmount}
                        />
                    </td>
                    <td className={style.deleteCol}>
                        {canEdit && <div className={style.deleteIcon} onClick={() => { removeAssignment(splitIndex, index); }} />}
                    </td>
                </tr>
            );
        });
    };

    return (
        <div className={style.propertyTable}>
            <table className={style.dataGridTable}>
                <thead>
                    <tr>
                        {getHeaderCells()}
                    </tr>
                </thead>
                <tbody>
                    {getBody()}
                </tbody>
            </table>
            {canEdit && <span className={style.link} onClick={() => addAssignment(splitIndex)}>
                <div className={style.plus} />
                Add another Assignment
            </span>}
        </div>
    );
};

Assignment.propTypes = {
    canEdit: PropTypes.bool,
    addAssignment: PropTypes.func,
    removeAssignment: PropTypes.func,
    changeInput: PropTypes.func,
    assignments: PropTypes.array,
    splitIndex: PropTypes.number,
    errors: PropTypes.object
};

Assignment.defaultProps = {
    canEdit: true,
    errors: fromJS({})
};

export default Assignment;
