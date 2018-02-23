import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import style from '../style.css';
import * as actions from './actions';

const defaultProps = {
    currencies: []
};

export const Limits = (props) => {
    const {
        fieldValues,
        currencies
    } = props;

    const {
        addLimit,
        removeLimit,
        setLimitField
    } = props.actions;

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
        return fieldValues.limits.map((limit, index) => (
            <tr key={`Limit${index}`}>
                <td className={style.currency}>
                    <Dropdown
                      style={{width: '120px'}}
                      data={currencies}
                      defaultSelected={limit.currency}
                      placeholder='Currency'
                      onSelect={({value}) => { setLimitField(index, 'currency', value); }}
                    />
                </td>
                <td>
                    <Input
                      keyProp='txMin'
                      value={limit.txMin}
                      onChange={({value}) => setLimitField(index, 'txMin', value)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='txMax'
                      value={limit.txMax}
                      onChange={({value}) => setLimitField(index, 'txMax', value)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='dailyMaxAmount'
                      value={limit.dailyMaxAmount}
                      onChange={({value}) => setLimitField(index, 'dailyMaxAmount', value)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='dailyMaxCount'
                      value={limit.dailyMaxCount}
                      onChange={({value}) => setLimitField(index, 'dailyMaxCount', value)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='weeklyMaxAmount'
                      value={limit.weeklyMaxAmount}
                      onChange={({value}) => setLimitField(index, 'weeklyMaxAmount', value)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='weeklyMaxCount'
                      value={limit.weeklyMaxCount}
                      onChange={({value}) => setLimitField(index, 'weeklyMaxCount', value)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='monthlyMaxAmount'
                      value={limit.monthlyMaxAmount}
                      onChange={({value}) => setLimitField(index, 'monthlyMaxAmount', value)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='monthlyMaxCount'
                      value={limit.monthlyMaxCount}
                      onChange={({value}) => setLimitField(index, 'monthlyMaxCount', value)}
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
    fieldValues: PropTypes.object,
    actions: PropTypes.object
};
const mapStateToProps = (state) => ({
    fieldValues: state.ruleLimitTabReducer.get('fields').toJS(),
    currencies: state.ruleTabReducer.getIn(['nomenclatures', 'currency']).toJS()
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Limits);
