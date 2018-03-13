import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import DatePicker from 'ut-front-react/components/DatePicker/Simple';
import Property from '../../../../components/Property';
import { fromJS } from 'immutable';
import style from '../style.css';
import * as actions from '../../actions';
const destinationProp = 'operation';
const propTypes = {
    operations: PropTypes.array,
    fieldValues: PropTypes.object,
    actions: PropTypes.object,
    errors: PropTypes.object // immutable
};

const defaultProps = {
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
            fieldValues
        } = this.props;
        let changeInput = (field) => {
            this.props.actions.changeInput(field, destinationProp);
        };
        var minDate = fieldValues.startDate ? new Date(fieldValues.startDate) : new Date(null);
        return (
            <div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      name='opearations'
                      label={'Operation'}
                      value={fieldValues.operations}
                      options={operations}
                      onChange={(value) => { changeInput({key: 'operations', value}); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <div className={style.outerWrap}>
                        <div className={style.lableWrap}>Start Date</div>
                        <div className={style.inputWrap}>
                            <DatePicker
                              wrapperStyles={{backgroundColor: 'white'}}
                              keyProp='startDate'
                              mode='landscape'
                              onChange={({value}) => { changeInput({key: 'startDate', value}); }}
                              defaultValue={fieldValues.startDate}
                            />
                        </div>
                    </div>
                </div>
                <div className={style.inputWrapper}>
                    <div className={style.outerWrap}>
                        <div className={style.lableWrap}>End Date</div>
                        <div className={style.inputWrap}>
                            <DatePicker
                              wrapperStyles={{backgroundColor: 'white'}}
                              keyProp='endDate'
                              mode='landscape'
                              onChange={({value}) => { changeInput({key: 'endDate', value}); }}
                              minDate={minDate}
                              defaultValue={fieldValues.endDate}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderInfoFields() {
        let addProperty = () => {
            this.props.actions.addProperty(destinationProp);
        };
        let removeProperty = (index) => {
            this.props.actions.removeProperty(index, destinationProp);
        };
        let changeInput = (field) => {
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

OperationTab.propTypes = propTypes;
OperationTab.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    let { mode, id } = state.ruleProfileReducer.get('config').toJS();
    return {
        operations: state.ruleProfileReducer.getIn(['nomenclatures', 'operation']).toJS(),
        fieldValues: state.ruleProfileReducer.getIn([mode, id, destinationProp]).toJS(),
        errors: state.ruleProfileReducer.getIn([mode, id, 'errors', destinationProp]) || fromJS({})
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationTab);
