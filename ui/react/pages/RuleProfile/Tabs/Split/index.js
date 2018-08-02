import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import Button from 'ut-front-react/components/StandardButton';
import style from '../style.css';
import Assignments from './Assignment';
import Info from './Info';
import Cumulative from './Cumulative';
import * as actions from '../../actions';
import { externalValidate, errorMessage } from '../../validator';
import { fromJS } from 'immutable';
const destinationProp = 'split';
const propTypes = {
    canEdit: PropTypes.bool,
    currencies: PropTypes.array,
    actions: PropTypes.object,
    fieldValues: PropTypes.object,
    errors: PropTypes.object // immutable
};

const defaultProps = {
    canEdit: true,
    currencies: []
};

class SplitTab extends Component {
    renderFields(split, index) {
        const { currencies, errors, fieldValues, canEdit } = this.props;
        const {
            addCumulative,
            removeCumulative,
            addAssignment,
            removeAssignment,
            changeInput,
            addCumulativeRange,
            removeCumulativeRange,
            removeSplit
        } = this.props.actions;
        const { name, assignments, tags, cumulatives } = split;
        let additionalValidate = (field, fnprefix) => {
            if (!field.error) {
                let lastKey = field.key.split(',').pop();
                let extVal = externalValidate[`${fnprefix}_${lastKey}`];
                extVal && (field = extVal(field, fromJS(fieldValues), errors));
            }
            return field;
        };
        const setAssignment = (assId, field) => {
            field.key = ['splits', index, 'assignments', assId, field.key].join(',');
            field = additionalValidate(field, 'split_assignement');
            changeInput(field, destinationProp);
        };
        const setCumulative = (field, cumulativeId = 0) => {
            field.key = ['splits', index, 'cumulatives', cumulativeId, field.key].join(',');
            field.key.split(',').pop() === 'currency' && !field.error && field.value && (field = validateCurrency(field));
            field = additionalValidate(field, 'split_cumulative');
            changeInput(field, destinationProp);
        };
        let validateStartAmount = (cumulativeId, rangeId, field) => {
            var ranges = (cumulatives[cumulativeId] || {}).ranges || [];
            let isDuplicate = !!ranges.find((range) => { return range.startAmount === field.value; });
            isDuplicate && (field.error = true) && (field.errorMessage = errorMessage.startAmountUnique);
            return field;
        };
        let validateCurrency = (field) => {
            let isDuplicate = !!cumulatives.find((range) => { return range.currency === field.value; });
            isDuplicate && (field.error = true) && (field.errorMessage = errorMessage.cumulativeCurrencyUnique);
            return field;
        };
        const setCumulativeRange = (cumulativeId, rangeId, field) => {
            field.key = ['splits', index, 'cumulatives', cumulativeId, 'ranges', rangeId, field.key].join(',');
            field.key.split(',').pop() === 'startAmount' && !field.error && field.value && (field = validateStartAmount(cumulativeId, rangeId, field));
            field = additionalValidate(field, 'split_cumulative_range');
            changeInput(field, destinationProp);
        };
        const setInfo = (field) => {
            if (field.key === 'name') {
                let isDuplicate = !!fieldValues.splits.find((sp) => { return (sp.name || '').toLowerCase() === (field.value || '').toLowerCase(); });
                isDuplicate && (field.error = true) && (field.errorMessage = errorMessage.splitNameUnique);
            }
            field.key = ['splits', index, field.key].join(',');
            changeInput(field, destinationProp);
        };
        return (
            <div key={index}>
                <div className={style.splitHeader}>
                    <span className={style.label}>{name ? name.toUpperCase() : 'SPLIT NAME'}</span>
                    { canEdit && <Button onClick={() => removeSplit(index)} className={style.deleteButton} styleType='secondaryLight' label='DELETE SPLIT' /> }
                </div>
                <div className={style.splitWrapper}>
                    <div className={style.contentBox}>
                        <div className={style.contentBoxWrapper}>
                            <TitledContentBox
                              title='Split Info'
                              wrapperClassName >
                                  <Info
                                    canEdit={canEdit}
                                    changeInputField={setInfo}
                                    name={name}
                                    errors={errors.getIn(['splits', index])}
                                    selectedTags={tags} />
                            </TitledContentBox>
                            <div className={style.cumulativeWrapper}>
                              <TitledContentBox title='Cumulative' externalContentClasses={style.contentPadding} >
                                <Cumulative
                                  canEdit={canEdit}
                                  addCumulative={addCumulative}
                                  removeCumulative={removeCumulative}
                                  setCumulativeField={setCumulative}
                                  addCumulativeRange={addCumulativeRange}
                                  removeCumulativeRange={removeCumulativeRange}
                                  setCumulativeRangeField={setCumulativeRange}
                                  cumulatives={cumulatives}
                                  currencies={currencies}
                                  splitIndex={index}
                                  errors={errors.getIn(['splits', index, 'cumulatives'])}
                                />
                              </TitledContentBox>
                            </div>
                        </div>
                        <div className={style.contentBoxWrapper}>
                            <TitledContentBox title='Assignment'>
                              <Assignments
                                canEdit={canEdit}
                                addAssignment={addAssignment}
                                removeAssignment={removeAssignment}
                                changeInput={setAssignment}
                                assignments={assignments}
                                splitIndex={index}
                                errors={errors.getIn(['splits', index, 'assignments'])}
                                />
                            </TitledContentBox>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // componentWillMount() {
    //     // add empty split by default if split is null
    //     !this.props.fieldValues.splits && this.props.actions.addSplit();
    // }
    render() {
        const { addSplit } = this.props.actions;
        return (
            <div>
                {this.props.fieldValues.splits.map((split, index) => {
                    return this.renderFields(split, index);
                })}
                <span className={style.linkPlus} onClick={addSplit}>
                    <div className={style.plus} />
                    Add another Split
                </span>
            </div>
        );
    }
}

SplitTab.propTypes = propTypes;
SplitTab.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    let { mode, id } = state.ruleProfileReducer.get('config').toJS();
    return {
        canEdit: ownProps.canEdit,
        fieldValues: state.ruleProfileReducer.getIn([mode, id, 'split']).toJS(),
        currencies: state.ruleProfileReducer.getIn(['nomenclatures', 'currency']).toJS(),
        errors: state.ruleProfileReducer.getIn([mode, id, 'errors', 'split']) || fromJS({})
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SplitTab);
