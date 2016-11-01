import React, { PropTypes } from 'react';
import style from '../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const SectionLimit = React.createClass({
    propTypes: {
        currencies: PropTypes.array
    },
    getInitialState() {
        return {
            limitRows: 0
        };
    },
    addLimitRow() {
        this.setState({
            limitRows: this.state.limitRows + 1
        });
    },
    createLimitRows() {
        let rows = [];
        for (let i = 0; i < this.state.limitRows; i++) {
            rows.push((
                <tr key={i}>
                    <td>
                        <Dropdown
                          keyProp={'limitCurrency-' + i}
                          data={this.props.currencies}
                        />
                    </td>
                    <td>
                        <Input keyProp={'limitMinTransactions-' + i} />
                    </td>
                    <td>
                        <Input keyProp={'limitMaxTransactions-' + i} />
                    </td>
                    <td>
                        <Input keyProp={'limitMinDaily-' + i} />
                    </td>
                    <td>
                        <Input keyProp={'limitMaxDaily-' + i} />
                    </td>
                    <td>
                        <Input keyProp={'limitMinWeekly-' + i} />
                    </td>
                    <td>
                        <Input keyProp={'limitMaxWeekly-' + i} />
                    </td>
                    <td>
                        <Input keyProp={'limitMinMonthly-' + i} />
                    </td>
                    <td>
                        <Input keyProp={'limitMaxMonthly-' + i} />
                    </td>
                    <td>
                        <IconButton>
                            <ActionDelete />
                        </IconButton>
                    </td>
                </tr>
            ));
        }
        return rows;
    },
    render() {
        return (
            <div>
                <table className={style.dataGridTable}>
                    <thead>
                        <tr>
                            <th rowSpan={2} style={{ minWidth: '100px' }}>Currency</th>
                            <th colSpan={2}>Transactions</th>
                            <th colSpan={2}>Daily</th>
                            <th colSpan={2}>Weekly</th>
                            <th colSpan={2}>Monthly</th>
                            <th rowSpan={2}>&nbsp;</th>
                        </tr>
                        <tr>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Min</th>
                            <th>Max</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.createLimitRows()}
                    </tbody>
                </table>
                <button type="button" onClick={this.addLimitRow}>Add another limit</button>
            </div>
        );
    }
});

export default SectionLimit;
