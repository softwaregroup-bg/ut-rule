import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import style from '../style.css';
import * as actions from '../../actions';
const defaultProps = {
    currencies: []
};

export const Limits = (props) => {
    const { fieldValues, currencies } = props;

    const { addLimit, removeLimit, changeInput } = props.actions;
    const setLimitField = (index, field) => {
        field.key = [index, field.key].join(',');
        changeInput(field, 'limit');
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
        return fieldValues.map((limit, index) => (
            <tr key={`Limit${index}`}>
                <td className={style.currency}>
                    <Dropdown
                      style={{width: '120px'}}
                      keyProp={'currency'}
                      data={currencies}
                      defaultSelected={limit.currency}
                      placeholder='Currency'
                      onSelect={(field) => { setLimitField(index, field); }}
                    />
                </td>
                <td>
                    <Input
                      keyProp='txMin'
                      value={limit.txMin}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='txMax'
                      value={limit.txMax}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='dailyMaxAmount'
                      value={limit.dailyMaxAmount}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='dailyMaxCount'
                      value={limit.dailyMaxCount}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='weeklyMaxAmount'
                      value={limit.weeklyMaxAmount}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='weeklyMaxCount'
                      value={limit.weeklyMaxCount}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='monthlyMaxAmount'
                      value={limit.monthlyMaxAmount}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='monthlyMaxCount'
                      value={limit.monthlyMaxCount}
                      onChange={(field) => setLimitField(index, field)}
                    />
                </td>
                <td className={style.deleteCol}>
                    <div className={style.deleteIcon} onClick={() => { removeLimit(index); }} />
                </td>
            </tr>
        ));
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
                        <span className={style.link} onClick={addLimit}>
                            <div className={style.plus} />
                            Add another Limit
                        </span>
                    </div>
                </TitledContentBox>
            </div>
        </div>
    );
};

Limits.defaultProps = defaultProps;
Limits.propTypes = {
    currencies: PropTypes.array,
    fieldValues: PropTypes.array,
    actions: PropTypes.object
};
const mapStateToProps = (state) => {
    let { mode, id } = state.ruleProfileReducer.get('config').toJS();
    return {
        fieldValues: state.ruleProfileReducer.getIn([mode, id, 'limit']).toJS(),
        currencies: state.ruleProfileReducer.getIn(['nomenclatures', 'currency']).toJS()
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Limits);
