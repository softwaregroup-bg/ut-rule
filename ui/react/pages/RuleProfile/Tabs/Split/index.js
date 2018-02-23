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

const propTypes = {
    currencies: PropTypes.array,
    actions: PropTypes.object,
    fieldValues: PropTypes.object
};

const defaultProps = {
    currencies: []
};

class SplitTab extends Component {
    renderFields(split, index) {
        const { currencies } = this.props;
        const {
            addAssignment,
            removeAssignment,
            setAssignmentField,
            changeSplitInputField,
            changeSplitMultiSelectField,
            setCumulativeField,
            addCumulativeRange,
            removeCumulativeRange,
            setCumulativeRangeField,
            removeSplit
        } = this.props.actions;
        const {
            name,
            assignments,
            tags,
            cumulatives
        } = split;
        return (
            <div key={index}>
                <div className={style.splitHeader}>
                    <span className={style.label}>{name.toUpperCase() || 'SPLIT NAME'}</span>
                    <Button onClick={() => removeSplit(index)} className={style.deleteButton} styleType='secondaryLight' label='DELETE SPLIT' />
                </div>
                <div className={style.splitWrapper}>
                    <div className={style.contentBox}>
                        <div className={style.contentBoxWrapper}>
                            <TitledContentBox
                              title='Split Info'
                              wrapperClassName >
                                  <Info
                                    changeInputField={changeSplitInputField}
                                    changeMultiSelectField={changeSplitMultiSelectField}
                                    name={name}
                                    selectedTags={tags}
                                    splitIndex={index} />
                            </TitledContentBox>
                            <div className={style.rangeWrapper}>
                                <TitledContentBox title='Assignment'>
                                  <Assignments
                                    addAssignment={addAssignment}
                                    removeAssignment={removeAssignment}
                                    setAssignmentField={setAssignmentField}
                                    assignments={assignments}
                                    splitIndex={index}
                                    />
                                </TitledContentBox>
                            </div>
                        </div>
                        <div className={style.contentBoxWrapper}>
                            <TitledContentBox title='Cumulative' externalContentClasses={style.contentPadding} >
                              <Cumulative
                                setCumulativeField={setCumulativeField}
                                addCumulativeRange={addCumulativeRange}
                                removeCumulativeRange={removeCumulativeRange}
                                setCumulativeRangeField={setCumulativeRangeField}
                                cumulatives={cumulatives}
                                currencies={currencies}
                                splitIndex={index}
                                />
                            </TitledContentBox>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
    return {
        fieldValues: state.ruleProfileReducer.get('split').toJS(),
        currencies: state.ruleProfileReducer.getIn(['nomenclatures', 'currency']).toJS()
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SplitTab);
