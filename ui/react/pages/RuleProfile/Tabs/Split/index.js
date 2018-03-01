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
const destinationProp = 'split';
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
            changeInput,
            addCumulativeRange,
            removeCumulativeRange,
            removeSplit
        } = this.props.actions;
        const { name, assignments, tags, cumulatives } = split;
        const setAssignment = (assId, field) => {
            field.key = ['splits', index, 'assignments', assId, field.key].join(',');
            changeInput(field, destinationProp);
        };
        const setCumulative = (field) => {
            field.key = ['splits', index, 'cumulatives', 0, field.key].join(',');
            changeInput(field, destinationProp);
        };
        const setCumulativeRange = (cumulativeId, rangeId, field) => {
            field.key = ['splits', index, 'cumulatives', cumulativeId, 'ranges', rangeId, field.key].join(',');
            changeInput(field, destinationProp);
        };
        const setInfo = (field) => {
            field.key = ['splits', index, field.key].join(',');
            changeInput(field, destinationProp);
        };
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
                                    changeInputField={setInfo}
                                    name={name}
                                    selectedTags={tags} />
                            </TitledContentBox>
                            <div className={style.rangeWrapper}>
                                <TitledContentBox title='Assignment'>
                                  <Assignments
                                    addAssignment={addAssignment}
                                    removeAssignment={removeAssignment}
                                    changeInput={setAssignment}
                                    assignments={assignments}
                                    splitIndex={index}
                                    />
                                </TitledContentBox>
                            </div>
                        </div>
                        <div className={style.contentBoxWrapper}>
                            <TitledContentBox title='Cumulative' externalContentClasses={style.contentPadding} >
                              <Cumulative
                                setCumulativeField={setCumulative}
                                addCumulativeRange={addCumulativeRange}
                                removeCumulativeRange={removeCumulativeRange}
                                setCumulativeRangeField={setCumulativeRange}
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
        fieldValues: state.ruleProfileReducer.getIn([mode, id, 'split']).toJS(),
        currencies: state.ruleProfileReducer.getIn(['nomenclatures', 'currency']).toJS()
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SplitTab);
