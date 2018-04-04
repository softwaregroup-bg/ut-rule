import React, { Component, PropTypes } from 'react';
import Input from 'ut-front-react/components/Input';
import style from './style.css';

class Property extends Component {
    constructor(props, context) {
        super(props, context);
        this.getPropetyRowsBody = this.getPropetyRowsBody.bind(this);
        this.getPropertyHeaderCells = this.getPropertyHeaderCells.bind(this);
    }
    getPropertyHeaderCells() {
        return [
            {name: 'Name', key: 'name'},
            {name: 'Value', key: 'value'},
            {name: '', key: 'rangeActions', className: style.deleteCol}
        ].map((cell, i) => (
            <th key={i} className={cell.className || ''}>{cell.name}</th>
        ));
    }
    getPropetyRowsBody() {
        const { properties, removeProperty, changeInput, errors, canEdit } = this.props;
        return properties.map((prop, index) => {
            let idx = index.toString();
            return (
                <tr key={`${index}`}>
                    <td>
                        <Input
                          readonly={!canEdit}
                          keyProp={['properties', index, 'name'].join(',')}
                          isValid={!errors.getIn(['properties', idx, 'name'])}
                          errorMessage={errors.getIn(['properties', idx, 'name'])}
                          onChange={(field) => { changeInput(field); }}
                          value={prop.name}
                        />
                    </td>
                    <td>
                        <Input
                          readonly={!canEdit}
                          keyProp={['properties', index, 'value'].join(',')}
                          isValid={!errors.getIn(['properties', idx, 'value'])}
                          errorMessage={errors.getIn(['properties', idx, 'value'])}
                          onChange={(field) => { changeInput(field); }}
                          value={prop.value}
                        />
                    </td>
                    <td className={style.deleteCol}>
                        { canEdit && <div className={style.deleteIcon} onClick={() => { removeProperty(index); }} /> }
                    </td>
                </tr>
            );
        });
    }
    render() {
        let { addProperty, canEdit } = this.props;
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
                { canEdit && <span className={style.link} onClick={addProperty}>
                    <div className={style.plus} />
                    Add another property
                </span> }
            </div>
        );
    }
}

Property.propTypes = {
    canEdit: PropTypes.bool,
    properties: PropTypes.array,
    changeInput: PropTypes.func,
    addProperty: PropTypes.func,
    removeProperty: PropTypes.func,
    errors: PropTypes.object // immuatble object
};

Property.defaultProps = {
    canEdit: true
};

export default Property;
