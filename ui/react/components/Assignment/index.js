import React from 'react';

const propTypes = {

}

const Assignment = (props) => {

    getPropertyHeaderCells() {
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
    }

    getPropetyRowsBody() {
        const { properties } = this.props.fieldValues;
        const { removeProperty, setPropertyField } = this.props.actions;
        return properties.map((prop, index) => {
            return (
                <tr key={`${index}`}>
                    <td>
                        <Input
                          keyProp='description'
                          onChange={({key, value}) => { setPropertyField(index, key, value); }}
                          value={prop.name}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='debit'
                          onChange={({key, value}) => { setPropertyField(index, key, value); }}
                          value={prop.name}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='credit'
                          onChange={({key, value}) => { setPropertyField(index, key, value); }}
                          value={prop.name}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='percent'
                          onChange={({key, value}) => { setPropertyField(index, key, value); }}
                          value={prop.name}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='minAmount'
                          onChange={({key, value}) => { setPropertyField(index, key, value); }}
                          value={prop.name}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='maxAmount'
                          onChange={({key, value}) => { setPropertyField(index, key, value); }}
                          value={prop.name}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='montlyAmount'
                          onChange={({key, value}) => { setPropertyField(index, key, value); }}
                          value={prop.name}
                        />
                    </td>
                    <td>
                        <img
                          src={deleteImage}
                          className={style.deleteButton}
                          onClick={() => { removeProperty(index); }}
                        />
                    </td>
                </tr>
            );
        });
    }

    return (
        <div className={style.propertyTable}>
            <table className={style.dataGridTable}>
                <thead>
                    <tr>
                        {this.getPropertyHeaderCells()}
                    </tr>
                </thead>
                <tbody >
                    {this.getPropetyRowsBody()}
                </tbody>
            </table>
            <span className={style.link} onClick={addProperty}>
                <img src={plusImage} className={style.plus} />
                Add another property
            </span>
        </div>
    );
}

Assignment.propTypes = propTypes;

export default Assignment;
