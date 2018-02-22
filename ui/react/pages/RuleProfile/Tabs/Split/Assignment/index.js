import React from 'react';
import Input from 'ut-front-react/components/Input';

import style from '../style.css';
import plusImage from '../assets/add_new.png';
import deleteImage from '../assets/delete.png';

export const Assignments = (props) => {
    const {
        addAssignment,
        removeAssignment,
        setAssignmentField,
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
            {name: '', key: 'rangeActions', className: style.deleteButton}
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
                          keyProp='description'
                          onChange={({key, value}) => { setAssignmentField(splitIndex, index, key, value); }}
                          value={prop.description}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='debit'
                          onChange={({key, value}) => { setAssignmentField(splitIndex, index, key, value); }}
                          value={prop.debit}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='credit'
                          onChange={({key, value}) => { setAssignmentField(splitIndex, index, key, value); }}
                          value={prop.credit}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='percent'
                          onChange={({key, value}) => { setAssignmentField(splitIndex, index, key, value); }}
                          value={prop.percent}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='minAmount'
                          onChange={({key, value}) => { setAssignmentField(splitIndex, index, key, value); }}
                          value={prop.minAmount}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='maxAmount'
                          onChange={({key, value}) => { setAssignmentField(splitIndex, index, key, value); }}
                          value={prop.maxAmount}
                        />
                    </td>
                    <td>
                        <img
                          src={deleteImage}
                          className={style.deleteButton}
                          onClick={() => { removeAssignment(splitIndex, index); }}
                        />
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
                <img src={plusImage} className={style.plus} />
                Add another Assignment
            </span>
        </div>
    );
};

export default Assignments;
