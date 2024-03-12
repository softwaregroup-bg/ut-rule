import PropTypes from 'prop-types';
import React from 'react';
import {fromJS} from 'immutable';
import {SimpleGrid} from 'ut-front-react/components/SimpleGrid';
import { updateGridColumnStorage, prepareGridFields } from 'ut-front-react/components/GridMenu/helpers';
import Text from 'ut-front-react/components/Text';

import style from './style.css';
import { Link } from 'react-router-dom';
const propInStorage = 'rule_grid_fields';

export default class Grid extends React.Component {
    static propTypes = {
        data: PropTypes.object,
        columns: PropTypes.object,
        formatedGridData: PropTypes.object,
        selectedConditions: PropTypes.object,
        handleCheckboxSelect: PropTypes.func,
        handleHeaderCheckboxSelect: PropTypes.func
    };

    state = {
        expandedGridColumns: [],
        columns: this.props.columns,
        fields: [
            {title: this.props.columns.priority.title, name: 'priority'},
            {title: this.props.columns.name.title, name: 'name'},
            {title: this.props.columns.channel.title, name: 'channel'},
            {title: this.props.columns.operation.title, name: 'operation'},
            {title: this.props.columns.source.title, name: 'source'},
            {title: this.props.columns.destination.title, name: 'destination'},
            {title: this.props.columns.limit.title, name: 'limit'},
            {
                title: 'Expansion',
                name: 'expansion'
            }
        ].map(f => {
            f.key = f.name;
            return f;
        })
    };

    handleGridExpansion = (id) => {
        const expandedGridColumns = this.state.expandedGridColumns;
        if (expandedGridColumns.some(v => v === id)) {
            const index = expandedGridColumns.indexOf(id);
            expandedGridColumns.splice(index, 1);
        } else {
            expandedGridColumns.push(id);
        }
        this.setState({expandedGridColumns});
    };

    renderGridColumn = (condition, keysToInclude, row, column) => {
        const result = [];
        for (const keyToInclude of keysToInclude) {
            if (Array.isArray(condition[keyToInclude])) {
                for (const index in condition[keyToInclude]) {
                    const record = condition[keyToInclude][index];
                    if (index > 4 && !this.state.expandedGridColumns.some(v => v === row.priority)) break;
                    result.push(<div key={result.length}>
                        <b>{record.name + ':'}</b>{record.value}
                    </div>);
                }
            }
        }
        if (row.operationEndDate && column === 'operation') {
            result.push(
                <div key={result.length}>
                    <b>End Date: </b>{row.operationEndDate.slice(0, 10)}
                </div>
            );
        }
        if (row.operationStartDate && column === 'operation') {
            result.push(
                <div key={result.length}>
                    <b>Start Date: </b>{row.operationStartDate.slice(0, 10)}
                </div>
            );
        }
        if (row.destinationAccountId && column === 'destination') {
            result.push(
                <div key={result.length}>
                    <b>Destination Account: </b>{row.destinationAccountId}
                </div>
            );
        }
        if (row.priority && column === 'priority') {
            result.push(
                <div key={result.length}>
                    <Link to={row.url}>{row.priority}</Link>
                </div>
            );
        }
        return (
            <div>
                {result}
            </div>
        );
    };

    updateColumns = (columns) => {
        this.setState({
            columns
        });
    };

    handleRowClick = (record, index) => {
        this.props.handleCheckboxSelect(null, record);
    };

    toggleColumn = (col) => {
        const fields = this.state.fields;
        const visibleFields = fields.filter((f) => { return f.visible !== false; });
        if (visibleFields.length !== 1 || col.visible === false) {
            const newFields = col && fields.map(function(f) {
                if (col.key === f.key) {
                    f.visible = f.visible === false ? !0 : !1;
                }
                return f;
            });
            col.visible = col.visible === false ? !0 : !1;
            updateGridColumnStorage(propInStorage, col);
            this.setState({fields: newFields});
        }
    };

    getData = () => {
        return Object.keys(this.props.data).map((conditionId, i) => {
            const record = this.props.data[conditionId];
            const condition = record.condition[0];
            const columns = this.state.columns;
            return {
                id: conditionId,
                destinationAccountId: condition.destinationAccountId,
                operationEndDate: condition.operationEndDate,
                name: condition.name,
                operationStartDate: condition.operationStartDate,
                priority: columns.priority.visible && condition.priority,
                channel: columns.channel.visible && this.props.formatedGridData[conditionId],
                operation: columns.operation.visible && this.props.formatedGridData[conditionId],
                source: columns.source.visible && this.props.formatedGridData[conditionId],
                destination: columns.destination.visible && this.props.formatedGridData[conditionId],
                limit: columns.limit.visible && this.props.formatedGridData[conditionId],
                split: columns.split.visible && this.props.formatedGridData[conditionId],
                expansion: 'Not Empty',
                url: record.url
            };
        });
    };

    transformCellValue = (value, header, row, isHeader) => {
        if (isHeader) {
            return value;
        } else {
            if (!value) {
                return;
            }
            switch (header.name) {
                case 'channel':
                    return this.renderGridColumn(value, ['cs', 'co'], row, 'channel');
                case 'operation':
                    return this.renderGridColumn(value, ['oc'], row, 'operation');
                case 'source':
                    return this.renderGridColumn(value, ['ss', 'sc', 'so'], row, 'source');
                case 'destination':
                    return this.renderGridColumn(value, ['ds', 'dc', 'do'], row, 'destination');
                case 'limit':
                    return this.renderGridColumn(value, ['limit'], row, 'limit');
                case 'split':
                    return this.renderGridColumn(value, ['split'], row, 'split');
                case 'priority':
                    return this.renderGridColumn(value, ['priority'], row, 'priority');
                case 'expansion': {
                    let showText;
                    Object.values(row?.channel).every(data => {
                        if (data.length >= 10) {
                            showText = true;
                            return false;
                        }
                        return true;
                    });
                    if (showText) {
                        const expansionText = this.state.expandedGridColumns.some(v => v === row.priority) ? 'See less...' : 'See more...';
                        return <a onClick={(e) => { e.preventDefault(); this.handleGridExpansion(row.priority); }}>{expansionText}</a>;
                    } else {
                        return '';
                    }
                }
                default:
                    return value;
            }
        }
    };

    render() {
        const data = fromJS(this.getData()).sort((a, b) => {
            return a.get('priority') - b.get('priority');
        }).toJS();

        return (
            <SimpleGrid
                globalMenu
                cssStandard
                emptyRowsMsg={<Text>No result</Text>}
                toggleColumnVisibility={this.toggleColumn}
                multiSelect
                fields={this.state.fields.filter((column) => (!this.state.columns[column.name] || this.state.columns[column.name].visible))}
                handleCheckboxSelect={this.props.handleCheckboxSelect}
                handleHeaderCheckboxSelect={this.props.handleHeaderCheckboxSelect}
                handleRowClick={this.handleRowClick}
                externalStyle={style}
                mainClassName='dataGridTable'
                rowsChecked={data.filter(x => this.props.selectedConditions[x.id])}
                data={data}
                transformCellValue={this.transformCellValue}
            />
        );
    }
}
