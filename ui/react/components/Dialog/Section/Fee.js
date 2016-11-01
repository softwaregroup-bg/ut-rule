import React, { PropTypes } from 'react';
import style from '../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const SectionFee = React.createClass({
    propTypes: {
        currencies: PropTypes.array
    },
    getInitialState() {
        return {
            feeRows: 0
        };
    },
    createHeaderCells() {
        return [
            {name: 'Type', key: 'feeType'},
            {name: 'Currency', key: 'feeCurrency'},
            {name: '%', key: 'feePercent'},
            {name: '% Base', key: 'feePercentBase'},
            {name: 'Min Amount', key: 'feeMinAmount'},
            {name: 'Max Amount', key: 'feeMaxAmount'},
            {name: ' ', key: 'feeActions'}
        ].map((cell, i) => (
            <th key={i}>{cell.name}</th>
        ));
    },
    addFeeRow() {
        this.setState({
            feeRows: this.state.feeRows + 1
        });
    },
    createFeeRows() {
        var feeRows = [];
        for (let i = 0; i < this.state.feeRows; i++) {
            feeRows.push((
                <tr key={i}>
                    <td>
                        <Input keyProp={'feeType-' + i} />
                    </td>
                    <td style={{minWidth: '100px'}}>
                        <Dropdown keyProp={'feeCurrency-' + i} data={this.props.currencies} />
                    </td>
                    <td>
                        <Input keyProp={'feePercent-' + i} />
                    </td>
                    <td>
                        <Input keyProp={'feeBasePercent-' + i} />
                    </td>
                    <td>
                        <Input keyProp={'feeMinAmount-' + i} />
                    </td>
                    <td>
                        <Input keyProp={'feeMaxAmount-' + i} />
                    </td>
                    <td>
                        <IconButton>
                            <ActionDelete />
                        </IconButton>
                    </td>
                </tr>
            ));
        }
        return feeRows;
    },
    render() {
        return (
            <div>
                <table className={style.dataGridTable}>
                    <thead>
                        <tr>
                            {this.createHeaderCells()}
                        </tr>
                    </thead>
                    <tbody className={style.limitTableBody}>
                        {this.createFeeRows()}
                    </tbody>
                </table>
                <button type="button" onClick={this.addFeeRow}>Add another fee</button>
            </div>
        );
    }
});

export default SectionFee;
