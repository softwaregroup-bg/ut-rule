import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import MultiSelectDropdown from 'ut-front-react/components/Input/MultiSelectDropdown';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import { fromJS } from 'immutable';
import Property from '../../../../components/Property';
import { getRuleProperties } from '../../helpers';
import {errorMessage} from '../../validator';
import style from '../style.css';
import * as actions from '../../actions';
const destinationProp = 'destination';
const propTypes = {
    canEdit: PropTypes.bool,
    rule: PropTypes.object,
    actions: PropTypes.object,
    countries: PropTypes.array,
    regions: PropTypes.array,
    cities: PropTypes.array,
    organizations: PropTypes.array,
    accountProducts: PropTypes.array,
    fieldValues: PropTypes.object,
    errors: PropTypes.object // immutable
};

const defaultProps = {
    canEdit: true,
    countries: [],
    regions: [],
    cities: [],
    organizations: []
};

class DestinationTab extends Component {
    constructor(props, context) {
        super(props, context);
        this.renderFields = this.renderFields.bind(this);
    }

    renderFields() {
        const {
            canEdit,
            countries,
            regions,
            cities,
            organizations,
            accountProducts,
            fieldValues
        } = this.props;
        let changeInput = (field, value) => {
            this.props.actions.changeInput(field, destinationProp);
        };
        let readonly = !canEdit;
        return (
            <div>
                <div className={style.inputWrapper}>
                    <MultiSelectDropdown
                      boldLabel
                      disabled={readonly}
                      keyProp='countries'
                      label={'Country'}
                      placeholder='Select Country'
                      defaultSelected={fieldValues.countries}
                      data={countries}
                      onSelect={(field) => { changeInput(field); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <MultiSelectDropdown
                      boldLabel
                      disabled={readonly}
                      keyProp='regions'
                      label={'Region'}
                      placeholder='Select Region'
                      defaultSelected={fieldValues.regions}
                      data={regions}
                      onSelect={(field) => { changeInput(field); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <MultiSelectDropdown
                      boldLabel
                      disabled={readonly}
                      keyProp='cities'
                      label='City'
                      placeholder='Select City'
                      defaultSelected={fieldValues.cities}
                      data={cities}
                      onSelect={(field) => { changeInput(field); }}
                      />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      disabled={readonly}
                      canSelectPlaceholder
                      keyProp={'organization'}
                      data={organizations}
                      defaultSelected={fieldValues.organization}
                      placeholder='Select Organization'
                      onSelect={(field) => { changeInput(field); }}
                      label={'Organization'}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      disabled={readonly}
                      canSelectPlaceholder
                      keyProp={'accountProduct'}
                      data={accountProducts}
                      defaultSelected={fieldValues.accountProduct}
                      placeholder='Select Account Product'
                      onSelect={(field) => { changeInput(field); }}
                      label={'Account Product'}
                    />
                </div>
            </div>
        );
    }

    renderInfoFields() {
        let properties = getRuleProperties(this.props.rule);
        let addProperty = () => {
            this.props.actions.addProperty(destinationProp);
        };
        let removeProperty = (index) => {
            this.props.actions.removeProperty(index, destinationProp);
        };
        let changeInput = (field) => {
            if (field.key.split(',').pop() === 'name' && !field.error && field.value) {
                let isDuplicateProperty = !!properties.find((prop) => { return prop.name.toLowerCase() === field.value.toLowerCase(); });
                isDuplicateProperty && (field.error = true) && (field.errorMessage = errorMessage.propertyNameUnique);
            }
            this.props.actions.changeInput(field, destinationProp);
        };
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
                      <Property
                        canEdit={this.props.canEdit}
                        addProperty={addProperty}
                        removeProperty={removeProperty}
                        changeInput={changeInput}
                        properties={(this.props.fieldValues || {}).properties || []}
                        errors={this.props.errors}
                        />
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
    let { mode, id } = state.ruleProfileReducer.get('config').toJS();
    let immutableRule = state.ruleProfileReducer.getIn([mode, id]);
    return {
        canEdit: ownProps.canEdit,
        rule: immutableRule ? immutableRule.toJS() : {},
        countries: state.ruleProfileReducer.getIn(['nomenclatures', 'country']).toJS(),
        regions: state.ruleProfileReducer.getIn(['nomenclatures', 'region']).toJS(),
        cities: state.ruleProfileReducer.getIn(['nomenclatures', 'city']).toJS(),
        organizations: state.ruleProfileReducer.getIn(['nomenclatures', 'organization']).toJS(),
        fieldValues: state.ruleProfileReducer.getIn([mode, id, destinationProp]).toJS(),
        accountProducts: state.ruleProfileReducer.getIn(['nomenclatures', 'accountProduct']).toJS(),
        errors: state.ruleProfileReducer.getIn([mode, id, 'errors', destinationProp]) || fromJS({})
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DestinationTab);
