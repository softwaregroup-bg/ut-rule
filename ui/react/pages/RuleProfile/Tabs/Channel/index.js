import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import Input from 'ut-front-react/components/Input';
import Property from '../../../../components/Property';
import style from '../style.css';
import * as actions from '../../actions';
import { getRuleProperties } from '../../helpers';
import {validations, errorMessage} from '../../validator';
import { fromJS } from 'immutable';
const destinationProp = 'channel';
const propTypes = {
    mode: PropTypes.string,
    canEdit: PropTypes.bool,
    rule: PropTypes.object,
    actions: PropTypes.object,
    countries: PropTypes.array,
    regions: PropTypes.array,
    cities: PropTypes.array,
    organizations: PropTypes.array,
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

class ChannelTab extends Component {
    constructor(props, context) {
        super(props, context);
        this.renderFields = this.renderFields.bind(this);
    }
    renderPriority() {
        const {
            fieldValues,
            errors,
            mode
        } = this.props;
        let changeInput = (field) => {
            this.props.actions.changeInput(field, destinationProp);
        };
        return (
            <div className={style.inputWrapper}>
              <Input
                label='Priority'
                keyProp='priority'
                readonly={mode !== 'create'}
                value={fieldValues.priority}
                validators={validations.priority}
                isValid={!errors.get('priority')} errorMessage={errors.get('priority')}
                onChange={(field) => changeInput(field)}
            />
            </div>
        );
    }
    renderFields() {
        const {
            canEdit,
            countries,
            regions,
            cities,
            organizations,
            fieldValues
        } = this.props;
        let changeInput = (field) => {
            this.props.actions.changeInput(field, destinationProp);
        };
        let readonly = !canEdit;
        return (
            <div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      disabled={readonly}
                      name='country'
                      label={'Country'}
                      value={fieldValues.countries}
                      options={countries}
                      onChange={(value) => { changeInput({key: 'countries', value}); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      disabled={readonly}
                      name='region'
                      label={'Region'}
                      value={fieldValues.regions}
                      options={regions}
                      onChange={(value) => { changeInput({key: 'regions', value}); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      disabled={readonly}
                      name='city'
                      label={'City'}
                      value={fieldValues.cities}
                      options={cities}
                      onChange={(value) => { changeInput({key: 'cities', value}); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      disabled={readonly}
                      canSelectPlaceholder
                      keyProp={'organization'}
                      data={organizations}
                      defaultSelected={fieldValues.organization}
                      placeholder='Enter Organization'
                      onSelect={(field) => { changeInput(field); }}
                      label={'Organization'}
                    />
                </div>
            </div>
        );
    }

    renderInfoFields() {
        let { canEdit, rule, actions, fieldValues, errors } = this.props;
        let properties = getRuleProperties(rule);
        let addProperty = () => {
            actions.addProperty(destinationProp);
        };
        let removeProperty = (index) => {
            actions.removeProperty(index, destinationProp);
        };
        let changeInput = (field) => {
            if (field.key.split(',').pop() === 'name' && !field.error && field.value) {
                let isDuplicateProperty = !!properties.find((prop) => { return prop.name === field.value; });
                isDuplicateProperty && (field.error = true) && (field.errorMessage = errorMessage.propertyNameUnique);
            }
            actions.changeInput(field, destinationProp);
        };
        return (
            <div className={style.contentBox}>
                <div className={style.contentBoxWrapper}>
                    <div className={style.innerContentBoxWrapper}>
                        <TitledContentBox
                          title='Priority'
                          wrapperClassName
                        >
                            {this.renderPriority()}
                        </TitledContentBox>
                    </div>
                    <div className={style.innerContentBoxWrapper}>
                        <TitledContentBox
                          title='Channel Info'
                          wrapperClassName
                        >
                            {this.renderFields()}
                        </TitledContentBox>
                    </div>
                </div>
                <div className={style.contentBoxWrapper}>
                    <TitledContentBox
                      title='Properties'
                      wrapperClassName
                    >
                        <Property
                          canEdit={canEdit}
                          addProperty={addProperty}
                          removeProperty={removeProperty}
                          changeInput={changeInput}
                          properties={(fieldValues || {}).properties || []}
                          errors={errors}
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

ChannelTab.propTypes = propTypes;
ChannelTab.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    let { mode, id } = state.ruleProfileReducer.get('config').toJS();
    let immutableRule = state.ruleProfileReducer.getIn([mode, id]);
    return {
        mode,
        canEdit: ownProps.canEdit,
        rule: immutableRule ? immutableRule.toJS() : {},
        countries: state.ruleProfileReducer.getIn(['nomenclatures', 'country']).toJS(),
        regions: state.ruleProfileReducer.getIn(['nomenclatures', 'region']).toJS(),
        cities: state.ruleProfileReducer.getIn(['nomenclatures', 'city']).toJS(),
        organizations: state.ruleProfileReducer.getIn(['nomenclatures', 'organization']).toJS(),
        fieldValues: state.ruleProfileReducer.getIn([mode, id, destinationProp]).toJS(),
        errors: state.ruleProfileReducer.getIn([mode, id, 'errors', destinationProp]) || fromJS({})
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelTab);
