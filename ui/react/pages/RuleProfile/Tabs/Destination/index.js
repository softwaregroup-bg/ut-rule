import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeTab } from 'ut-front-react/containers/TabMenu/actions';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import Input from 'ut-front-react/components/Input';
import style from './style.css';

import plusImage from './assets/add_new.png';
import deleteImage from './assets/delete.png';

import * as actions from './actions';

const propTypes = {

};

const defaultProps = {
    countries: [],
    regions: [],
    cities: [],
    organizations: []
};

class DestinationTab extends Component {
    constructor(props, context) {
        super(props, context);
        this.renderFields = this.renderFields.bind(this);
        this.getPropetyRowsBody = this.getPropetyRowsBody.bind(this);
        this.renderPropertyTable = this.renderPropertyTable.bind(this);
    }

    getPropertyHeaderCells() {
        return [
            {name: 'Name', key: 'name'},
            {name: 'Value', key: 'value'},
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
                          keyProp='name'
                          onChange={({key, value}) => { setPropertyField(index, key, value); }}
                          value={prop.name}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='value'
                          onChange={({key, value}) => { setPropertyField(index, key, value); }}
                          value={prop.value}
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

    renderPropertyTable() {
        const { addProperty } = this.props.actions;
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

    renderFields() {
        const {
            countries,
            regions,
            cities,
            organizations,
            fieldValues
        } = this.props;

        const {
            changeMultiSelectField,
            changeDropdownField
        } = this.props.actions;

        return (
            <div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      name='country'
                      label={'Country'}
                      value={fieldValues.countries}
                      options={countries}
                      onChange={(value) => { changeMultiSelectField('countries', value); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      name='region'
                      label={'Region'}
                      value={fieldValues.regions}
                      options={regions}
                      onChange={(value) => { changeMultiSelectField('regions', value); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      name='city'
                      label={'City'}
                      value={fieldValues.cities}
                      options={cities}
                      onChange={(value) => { changeMultiSelectField('cities', value); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      canSelectPlaceholder
                      data={organizations}
                      defaultSelected={fieldValues.organization}
                      placeholder='Enter Organizaton'
                      onSelect={({value}) => { changeDropdownField('organization', value); }}
                      label={'Organizaton'}
                    />
                </div>
            </div>
        );
    }

    renderInfoFields() {
        return (
            <div className={style.contentBox}>
                <div className={style.contentBoxWrapper}>
                    <TitledContentBox
                      title='Destination Info'
                      wrapperClassName
                    >
                        {this.renderFields()}
                    </TitledContentBox>
                </div>
                <div className={style.contentBoxWrapper}>
                    <TitledContentBox
                      title='Properties'
                      wrapperClassName
                    >
                        {this.renderPropertyTable()}
                    </TitledContentBox>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderInfoFields()}
            </div>
        );
    }
}

DestinationTab.propTypes = propTypes;
DestinationTab.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    return {
        countries: state.ruleTabReducer.getIn(['nomenclatures', 'country']),
        regions: state.ruleTabReducer.getIn(['nomenclatures', 'region']),
        cities: state.ruleTabReducer.getIn(['nomenclatures', 'city']),
        organizations: state.ruleTabReducer.getIn(['nomenclatures', 'organization']),
        fieldValues: state.ruleDestinationTabReducer.get('fields').toJS()
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DestinationTab);
