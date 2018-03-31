import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import style from '../style.css';
import * as actions from '../../actions';
import {validations, externalValidate} from '../../validator';
import { fromJS } from 'immutable';
const destinationProp = 'limit';
const defaultProps = {
    currencies: [],
    canEdit: true
};

export const Limits = (props) => {
    const { fieldValues, currencies, errors, canEdit } = props;
    const { addLimit, removeLimit, changeInput } = props.actions;
    const setLimitField = (index, field) => {
        field.key = [index, field.key].join(',');
        if (!field.error) {
            let lastKey = field.key.split(',').pop();
            let extVal = externalValidate[`limit_${lastKey}`];
            extVal && (field = extVal(field, fromJS(fieldValues), errors));
        }
        changeInput(field, destinationProp);
    };
    const renderTableHead = () => (
        <thead>
            <tr>
                <th rowSpan={2} style={{ minWidth: '100px' }}>Currency</th>
                <th colSpan={2}>Transaction Amount</th>
                <th colSpan={2}>Daily</th>
                <th colSpan={2}>Weekly</th>
                <th colSpan={2}>Monthly</th>
                <th rowSpan={2}>&nbsp;</th>
            </tr>
            <tr>
                <th>Min</th>
                <th>Max</th>
                <th>Max Amount</th>
                <th>Max Count</th>
                <th>Max Amount</th>
                <th>Max Count</th>
                <th>Max Amount</th>
                <th>Max Count</th>
            </tr>
        </thead>
    );
    const renderBody = () => {
        return fieldValues.map((limit, index) => {
            return (
              <tr key={`Limit${index}`}>
                <td className={style.currency}>
                    <Dropdown
                      disabled={!canEdit}
                      style={{width: '120px'}}
                      keyProp={'currency'}
                      isValid={!errors.getIn([index, 'currency'])}
                      errorMessage={errors.getIn([index, 'currency'])}
                      data={currencies}
                      defaultSelected={limit.currency}
                      placeholder='Currency'
                      onSelect={(field) => { setLimitField(index, field); }}
                    />
                </td>
                <td>
                    <Input
                      readonly={!canEdit}
                      keyProp='txMin'
                      value={limit.txMin}
                      validators={validations.amount}
                      isValid={!errors.getIn([index, 'txMin'])}
                      errorMessage={errors.getIn([index, 'txMin'])}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      readonly={!canEdit}
                      keyProp='txMax'
                      value={limit.txMax}
                      validators={validations.amount}
                      isValid={!errors.getIn([index, 'txMax'])}
                      errorMessage={errors.getIn([index, 'txMax'])}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      readonly={!canEdit}
                      keyProp='dailyMaxAmount'
                      value={limit.dailyMaxAmount}
                      validators={validations.amount}
                      isValid={!errors.getIn([index, 'dailyMaxAmount'])}
                      errorMessage={errors.getIn([index, 'dailyMaxAmount'])}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      readonly={!canEdit}
                      keyProp='dailyMaxCount'
                      value={limit.dailyMaxCount}
                      validators={validations.count}
                      isValid={!errors.getIn([index, 'dailyMaxCount'])}
                      errorMessage={errors.getIn([index, 'dailyMaxCount'])}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      readonly={!canEdit}
                      keyProp='weeklyMaxAmount'
                      validators={validations.amount}
                      isValid={!errors.getIn([index, 'weeklyMaxAmount'])}
                      errorMessage={errors.getIn([index, 'weeklyMaxAmount'])}
                      value={limit.weeklyMaxAmount}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      readonly={!canEdit}
                      keyProp='weeklyMaxCount'
                      value={limit.weeklyMaxCount}
                      validators={validations.count}
                      isValid={!errors.getIn([index, 'weeklyMaxCount'])}
                      errorMessage={errors.getIn([index, 'weeklyMaxCount'])}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      readonly={!canEdit}
                      keyProp='monthlyMaxAmount'
                      value={limit.monthlyMaxAmount}
                      validators={validations.amount}
                      isValid={!errors.getIn([index, 'monthlyMaxAmount'])}
                      errorMessage={errors.getIn([index, 'monthlyMaxAmount'])}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      readonly={!canEdit}
                      keyProp='monthlyMaxCount'
                      validators={validations.count}
                      isValid={!errors.getIn([index, 'monthlyMaxCount'])}
                      errorMessage={errors.getIn([index, 'monthlyMaxCount'])}
                      value={limit.monthlyMaxCount}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td className={style.deleteCol}>
                { canEdit && <div className={style.deleteIcon} onClick={() => { removeLimit(index); }} /> }
                </td>
              </tr>);
        });
    };

    return (
        <div className={style.contentBox}>
            <div className={classnames(style.contentBoxWrapper, style.limitContentBoxWrapper)}>
                <TitledContentBox
                  title='Limit Info'
                  wrapperClassName
                >
                    <div className={style.propertyTable}>
                        <table className={style.dataGridTable}>
                            {renderTableHead()}
                            <tbody>
                                {renderBody()}
                            </tbody>
                        </table>
                        { canEdit && <span className={style.link} onClick={addLimit}>
                            <div className={style.plus} />
                            Add another Limit
                          </span> }
                    </div>
                </TitledContentBox>
            </div>
        </div>
    );
};

Limits.defaultProps = defaultProps;
Limits.propTypes = {
    canEdit: PropTypes.bool,
    errors: PropTypes.object,
    currencies: PropTypes.array,
    fieldValues: PropTypes.array,
    actions: PropTypes.object
};
const mapStateToProps = (state, ownProps) => {
    let { mode, id } = state.ruleProfileReducer.get('config').toJS();
    return {
        canEdit: ownProps.canEdit,
        fieldValues: state.ruleProfileReducer.getIn([mode, id, destinationProp]).toJS(),
        currencies: state.ruleProfileReducer.getIn(['nomenclatures', 'currency']).toJS(),
        errors: state.ruleProfileReducer.getIn([mode, id, 'errors', destinationProp]) || fromJS({})
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Limits);
