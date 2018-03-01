import React, { PropTypes } from 'react';
import Input from 'ut-front-react/components/Input';

import style from '../../style.css';

export const Assignments = (props) => {
    const {
        addAssignment,
        removeAssignment,
        changeInput,
        assignments,
        splitIndex
    } = props;

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

    const getBody = () => {
        return assignments.map((prop, index) => {
            return (
                <tr key={`${index}`}>
                    <td>
                        <Input
                          keyProp={'description'}
                          onChange={(field) => { changeInput(index, field); }}
                          value={prop.description}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp={'debit'}
                          onChange={(field) => { changeInput(index, field); }}
                          value={prop.debit}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp={'credit'}
                          onChange={(field) => { changeInput(index, field); }}
                          value={prop.credit}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp={'percent'}
                          onChange={(field) => { changeInput(index, field); }}
                          value={prop.percent}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp={'minAmount'}
                          onChange={(field) => { changeInput(index, field); }}
                          value={prop.minAmount}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp={'maxAmount'}
                          onChange={(field) => { changeInput(index, field); }}
                          value={prop.maxAmount}
                        />
                    </td>
                    <td className={style.deleteCol}>
                        <div className={style.deleteIcon} onClick={() => { removeAssignment(splitIndex, index); }} />
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
                <tbody >
                    {getBody()}
                </tbody>
            </table>
            <span className={style.link} onClick={() => addAssignment(splitIndex)}>
                <div className={style.plus} />
                Add another Assignment
            </span>
        </div>
    );
};

Assignments.propTypes = {
    addAssignment: PropTypes.func,
    removeAssignment: PropTypes.func,
    changeInput: PropTypes.func,
    assignments: PropTypes.array,
    splitIndex: PropTypes.number
};

export default Assignments;
