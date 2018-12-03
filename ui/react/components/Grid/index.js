import React, { PropTypes } from 'react';
import { SimpleGrid } from 'ut-front-react/components/SimpleGrid';
import ContextMenu from '../ContextMenu';
import style from './style.css';

export default React.createClass({
    propTypes: {
        data: PropTypes.object,
        columns: PropTypes.object,
        nomenclatures: PropTypes.object,
        selectedConditions: PropTypes.object,
        refresh: PropTypes.func,
        handleCheckboxSelect: PropTypes.func,
        handleHeaderCheckboxSelect: PropTypes.func
    },
    getInitialState(state) {
        return {
            columns: this.props.columns
        };
    },
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    },
    buildList(arr) {
        // label, value, nomenclatureKey
        return arr.map((record, i) => {
            let value = record[2] && this.props.nomenclatures[record[2]] ? this.props.nomenclatures[record[2]][record[1]] : record[1];
            if (Array.isArray(value)) {
                return (
                    <div key={i}>
                        <b>{record[0] ? record[0] + ': ' : ''}</b>{value.map(v => v.name).join('|')}
                    </div>
                );
            } else if (value) {
                if (value && value.indexOf('T00')) {
                    value = value.split('T')[0];
                }
                return (
                    <div key={i}>
                        <b>{record[0] ? record[0] + ': ' : ''}</b>{value}
                    </div>
                );
            } else {
                return null;
            }
        });
    },
    updateColumns(columns) {
        this.setState({
            columns: columns
        });
    },
    handleRowClick(record, index) {
        let data = record;
        const isSelected = (this.props.selectedConditions && this.props.selectedConditions[data.id]);

        this.props.handleCheckboxSelect(isSelected, record);
    },
    getData() {
        return Object.keys(this.props.data).map((conditionId, i) => {
            let record = this.props.data[conditionId];
            let condition = record.condition[0];
            let columns = this.state.columns;

            return {
                id: conditionId,
                priority: columns.priority.visible && condition.priority,
                channel: columns.channel.visible && [
                    ['Channel', condition.channelId, 'channel'],
                    ['Tag', condition.channelTag],
                    ['Country', condition.channelCountryId, 'country'],
                    ['Region', condition.channelRegionId, 'region'],
                    ['City', condition.channelCityId, 'city'],
                    ['Business Unit', condition.channelOrganizationId, 'organization'],
                    ['Supervisor', condition.channelSupervisorId, 'supervisor'],
                    ['Customer Category', condition.channelRoleId, 'customerCategory']
                ],
                operation: columns.operation.visible && [
                    ['Operation', condition.operationId, 'operation'],
                    ['Tag', condition.operationTag],
                    ['Start Date', condition.operationStartDate],
                    ['End Date', condition.operationEndDate]
                ],
                source: columns.source.visible && [
                    ['Country', condition.sourceCountryId, 'country'],
                    ['Region', condition.sourceRegionId, 'region'],
                    ['City', condition.sourceCityId, 'city'],
                    ['Business Unit', condition.sourceOrganizationId, 'organization'],
                    ['Supervisor', condition.sourceSupervisorId, 'supervisor'],
                    ['Tag', condition.sourceTag]
                ],
                destination: columns.destination.visible && [
                    ['Country', condition.destinationCountryId, 'country'],
                    ['Region', condition.destinationRegionId, 'region'],
                    ['City', condition.destinationCityId, 'city'],
                    ['Business Unit', condition.destinationOrganizationId, 'organization'],
                    ['Supervisor', condition.destinationSupervisorId, 'supervisor'],
                    ['Tag', condition.destinationTag]
                ],
                limit: columns.limit.visible && record.limit,
                limitPerEntry: columns.limitPerEntry.visible && record.limitPerEntry,
                refresh: ''
            };
        }).sort((conditionA, conditionB) => Number(conditionA.priority) - Number(conditionB.priority));
    },
    transformCellValue(value, header, row, isHeader) {
        if (isHeader) {
            return value;
        } else {
            if (!value) {
                return;
            }
            switch (header.name) {
                case 'channel':
                case 'operation':
                case 'source':
                case 'destination':
                    return this.buildList(value);
                case 'limit':
                    return value.map((limit, i) => {
                        return this.buildList([
                            [
                                '',
                                i === 0 ? '' : <hr />
                            ],
                            [
                                'Currency',
                                limit.currency || ''
                            ],
                            [
                                'Transaction',
                                '' + (limit.maxAmount ? 'max ' + limit.maxAmount + ' ' : '') + (limit.minAmount ? 'min ' + limit.minAmount + ' ' : '')
                            ],
                            [
                                'Daily',
                                '' + (limit.maxAmountDaily ? 'max ' + limit.maxAmountDaily + ' ' : '') + (limit.maxCountDaily ? 'count ' + limit.maxCountDaily + ' ' : '')
                            ],
                            [
                                'Weekly',
                                '' + (limit.maxAmountWeekly ? 'max ' + limit.maxAmountWeekly + ' ' : '') + (limit.maxCountWeekly ? 'count ' + limit.maxCountWeekly + ' ' : '')
                            ],
                            [
                                'Monthly',
                                '' + (limit.maxAmountMonthly ? 'max ' + limit.maxAmountMonthly + ' ' : '') + (limit.maxCountMonthly ? 'count ' + limit.maxCountMonthly + ' ' : '')
                            ],
                            [
                                'Lifetime',
                                '' + (limit.maxAmountLifetime ? 'max ' + limit.maxAmountLifetime + ' ' : '') + (limit.maxCountLifetime ? 'count ' + limit.maxCountLifetime + ' ' : '')
                            ]
                        ]);
                    });
                case 'limitPerEntry':
                    return value.map((limit, i) => {
                        return this.buildList([
                            [
                                '',
                                i === 0 ? '' : <hr />
                            ],
                            [
                                'Currency',
                                limit.currency || ''
                            ],
                            [
                                'Transaction',
                                '' + (limit.maxAmount ? 'max ' + limit.maxAmount + ' ' : '') + (limit.minAmount ? 'min ' + limit.minAmount + ' ' : '')
                            ],
                            [
                                'Daily',
                                '' + (limit.maxAmountDaily ? 'max ' + limit.maxAmountDaily + ' ' : '') + (limit.maxCountDaily ? 'count ' + limit.maxCountDaily + ' ' : '')
                            ]
                        ]);
                    });
                default:
                    return value;
            }
        }
    },
    render() {
        let data = this.getData();
        let columns = this.state.columns;

        return <SimpleGrid
            ref='grid'
            multiSelect={false}
            fields={[
                { title: columns.priority.title, name: 'priority' },
                { title: columns.channel.title, name: 'channel' },
                { title: columns.operation.title, name: 'operation' },
                //   {title: columns.source.title, name: 'source'},
                //   {title: columns.destination.title, name: 'destination'},
                { title: columns.limit.title, name: 'limit' },
                //   {title: columns.limitPerEntry.title, name: 'limitPerEntry'},
                {
                    title: <div style={{ float: 'right' }}>
                        <ContextMenu
                            refresh={this.props.refresh}
                        />
                    </div>,
                    name: 'refresh'
                }
            ].filter((column) => (!this.state.columns[column.name] || this.state.columns[column.name].visible))}
            handleCheckboxSelect={this.props.handleCheckboxSelect}
            handleHeaderCheckboxSelect={this.props.handleHeaderCheckboxSelect}
            handleRowClick={this.handleRowClick}
            externalStyle={style}
            mainClassName='dataGridTable'
            rowsChecked={data.filter(x => this.props.selectedConditions[x.id])}
            data={data}
            transformCellValue={this.transformCellValue}
        />;
    }
});
