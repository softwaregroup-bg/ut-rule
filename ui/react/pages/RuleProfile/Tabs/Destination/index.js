import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
    feePolicies: PropTypes.array,
    organizations: PropTypes.array,
    accountProducts: PropTypes.array,
    fieldValues: PropTypes.object,
    errors: PropTypes.object, // immutable
    destinationConfig: PropTypes.object.isRequired
};

const defaultProps = {
    canEdit: true,
    countries: [],
    regions: [],
    cities: [],
    feePolicies: [],
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
            fieldValues,
            feePolicies,
            destinationConfig: { fields }
        } = this.props;
        const changeInput = (field, value) => {
            this.props.actions.changeInput(field, destinationProp);
        };
        const readonly = !canEdit;

        return (
            <div>
                {fields.country.visible && <div className={style.inputWrapper}>
                    <MultiSelectDropdown
                        boldLabel
                        disabled={readonly}
                        keyProp='countries'
                        label={fields.country.title || 'Country'}
                        placeholder='Select Country'
                        defaultSelected={fieldValues.countries}
                        data={countries}
                        onSelect={(field) => { changeInput(field); }}
                    />
                </div>}
                {fields.region.visible && <div className={style.inputWrapper}>
                    <MultiSelectDropdown
                        boldLabel
                        disabled={readonly}
                        keyProp='regions'
                        label={fields.region.title || 'Region'}
                        placeholder='Select Region'
                        defaultSelected={fieldValues.regions}
                        data={regions}
                        onSelect={(field) => { changeInput(field); }}
                    />
                </div>}
                {fields.city.visible && <div className={style.inputWrapper}>
                    <MultiSelectDropdown
                        boldLabel
                        disabled={readonly}
                        keyProp='cities'
                        label={fields.city.title || 'City'}
                        placeholder='Select City'
                        defaultSelected={fieldValues.cities}
                        data={cities}
                        onSelect={(field) => { changeInput(field); }}
                    />
                </div>}
                {fields.organization.visible && <div className={style.inputWrapper}>
                    <Dropdown
                        disabled={readonly}
                        canSelectPlaceholder
                        keyProp='organization'
                        data={organizations}
                        defaultSelected={fieldValues.organization}
                        placeholder='Select Organization'
                        onSelect={(field) => { changeInput(field); }}
                        label={fields.organization.title || 'Organization'}
                    />
                </div>}
                {fields.accountProduct.visible && <div className={style.inputWrapper}>
                    <Dropdown
                        disabled={readonly}
                        canSelectPlaceholder
                        keyProp='accountProduct'
                        data={accountProducts}
                        defaultSelected={fieldValues.accountProduct}
                        placeholder='Select Account Product'
                        onSelect={(field) => { changeInput(field); }}
                        label={fields.accountProduct.title || 'Account Product'}
                    />
                </div>}
                {fields.accountFeePolicy.visible && <div className={style.inputWrapper}>
                    <MultiSelectDropdown
                        boldLabel
                        disabled={readonly}
                        keyProp='accountFeePolicies'
                        label={fields.accountFeePolicy.title || 'Account Fee Policy'}
                        placeholder='Select Account Fee Policy'
                        defaultSelected={fieldValues.accountFeePolicies}
                        data={feePolicies}
                        onSelect={(field) => { changeInput(field); }}
                    />
                </div>}
            </div>
        );
    }

    renderInfoFields() {
        const properties = getRuleProperties(this.props.rule);
        const addProperty = () => {
            this.props.actions.addProperty(destinationProp);
        };
        const removeProperty = (index) => {
            this.props.actions.removeProperty(index, destinationProp);
        };
        const changeInput = (field) => {
            if (field.key.split(',').pop() === 'name' && !field.error && field.value) {
                const isDuplicateProperty = !!properties.find((prop) => { return (prop.name || '').toLowerCase() === (field.value || '').toLowerCase(); });
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
                {Object.keys(this.props.fieldValues).length > 0 && this.renderInfoFields()}
            </div>
        );
    }
}

DestinationTab.propTypes = propTypes;
DestinationTab.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    const { mode, id } = state.ruleProfileReducer.get('config').toJS();
    const immutableRule = state.ruleProfileReducer.getIn([mode, id]);
    return {
        canEdit: ownProps.canEdit,
        rule: immutableRule ? immutableRule.toJS() : {},
        countries: state.ruleProfileReducer.getIn(['nomenclatures', 'country']).toJS(),
        regions: state.ruleProfileReducer.getIn(['nomenclatures', 'region']).toJS(),
        cities: state.ruleProfileReducer.getIn(['nomenclatures', 'city']).toJS(),
        feePolicies: state.ruleProfileReducer.getIn(['nomenclatures', 'feePolicy']).toJS(),
        organizations: state.ruleProfileReducer.getIn(['nomenclatures', 'organization']).toJS(),
        fieldValues: state.ruleProfileReducer.getIn([mode, id, destinationProp], fromJS({})).toJS(),
        accountProducts: state.ruleProfileReducer.getIn(['nomenclatures', 'accountProduct']).toJS(),
        errors: state.ruleProfileReducer.getIn([mode, id, 'errors', destinationProp]) || fromJS({}),
        destinationConfig: state.uiConfig.getIn(['profile', 'tabs', 'destination']).toJS()
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DestinationTab);
