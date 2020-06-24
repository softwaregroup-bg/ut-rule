import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import MultiSelectDropdown from 'ut-front-react/components/Input/MultiSelectDropdown';
import DatePicker from 'ut-front-react/components/DatePicker/Simple';
import Property from '../../../../components/Property';
import { fromJS } from 'immutable';
import { getRuleProperties } from '../../helpers';
import {errorMessage} from '../../validator';
import style from '../style.css';
import * as actions from '../../actions';
const destinationProp = 'operation';
const propTypes = {
    canEdit: PropTypes.bool,
    rule: PropTypes.object,
    operations: PropTypes.array,
    fieldValues: PropTypes.object,
    actions: PropTypes.object,
    errors: PropTypes.object, // immutable
    operationConfig: PropTypes.object.isRequired
};

const defaultProps = {
    canEdit: true,
    operations: []
};

class OperationTab extends Component {
    constructor(props, context) {
        super(props, context);
        this.renderFields = this.renderFields.bind(this);
    }

    renderFields() {
        const {
            operations,
            fieldValues,
            canEdit,
            operationConfig: { fields }
        } = this.props;
        const changeInput = (field) => {
            this.props.actions.changeInput(field, destinationProp);
        };
        const minDate = fieldValues.startDate ? new Date(fieldValues.startDate) : new Date(null);

        return (
            <div>
                {fields.operation.visible && <div className={style.inputWrapper}>
                    <MultiSelectDropdown
                        boldLabel
                        disabled={!canEdit}
                        keyProp='operations'
                        label={fields.operation.title || 'Operation'}
                        placeholder='Select Operation'
                        defaultSelected={fieldValues.operations}
                        data={operations}
                        onSelect={(field) => { changeInput(field); }}
                    />
                </div>}
                {fields.operationStartDate.visible && <div className={style.inputWrapper}>
                    <div className={style.outerWrap}>
                        <div className={style.inputWrap}>
                            <DatePicker
                                label={fields.operationStartDate.title || 'Start Date'}
                                disabled={!canEdit}
                                wrapperStyles={{backgroundColor: 'white'}}
                                keyProp='startDate'
                                mode='landscape'
                                onChange={({value}) => { changeInput({key: 'startDate', value}); }}
                                defaultValue={fieldValues.startDate}
                                labelWrap={style.labelWrap}
                            />
                        </div>
                    </div>
                </div>}
                {fields.operationEndDate.visible && <div className={style.inputWrapper}>
                    <div className={style.outerWrap}>
                        <div className={style.inputWrap}>
                            <DatePicker
                                label={fields.operationEndDate.title || 'End Date'}
                                disabled={!canEdit}
                                wrapperStyles={{backgroundColor: 'white'}}
                                keyProp='endDate'
                                mode='landscape'
                                onChange={({value}) => { changeInput({key: 'endDate', value}); }}
                                minDate={minDate}
                                defaultValue={fieldValues.endDate}
                                labelWrap={style.labelWrap}
                            />
                        </div>
                    </div>
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
                        title='Operation Info'
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

OperationTab.propTypes = propTypes;
OperationTab.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    const { mode, id } = state.ruleProfileReducer.get('config').toJS();
    const immutableRule = state.ruleProfileReducer.getIn([mode, id]);
    return {
        canEdit: ownProps.canEdit,
        rule: immutableRule ? immutableRule.toJS() : {},
        operations: state.ruleProfileReducer.getIn(['nomenclatures', 'operation']).toJS(),
        fieldValues: state.ruleProfileReducer.getIn([mode, id, destinationProp], fromJS({})).toJS(),
        errors: state.ruleProfileReducer.getIn([mode, id, 'errors', destinationProp]) || fromJS({}),
        operationConfig: state.uiConfig.getIn(['profile', 'tabs', 'operation']).toJS()
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationTab);
