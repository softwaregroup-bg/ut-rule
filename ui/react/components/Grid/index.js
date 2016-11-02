import React, { PropTypes } from 'react';
import {SimpleGrid} from 'ut-front-react/components/SimpleGrid';
import style from './style.css';
import classnames from 'classnames';

const nestedTable = function(arr, className) {
    return <div className={style.nestedTableWrapper}>
        <table className={classnames(style.nested, className)}>
            <tbody>
                {
                    arr.map((tr, i) => {
                        return <tr key={i}>
                            {
                                (Array.isArray(tr) ? tr : [tr]).map((td, j) => {
                                    return <td key={j}>{td}</td>;
                                })
                            }
                        </tr>;
                    })
                }
            </tbody>
        </table>
    </div>;
};

const buildCSV = function(arr) {
    return arr.map((record) => {
        return record.value ? ((record.key ? record.key + ': ' : '') + record.value) : '';
    }).filter(val => val).join(', ');
};

export default React.createClass({
    propTypes: {
        data: PropTypes.object,
        nomenclatures: PropTypes.object,
        refresh: PropTypes.func,
        handleCheckboxSelect: PropTypes.func,
        handleHeaderCheckboxSelect: PropTypes.func
    },
    getInitialState() {
        return {
            columns: {
                priority: true,
                channel: true,
                operation: true,
                source: true,
                destination: true,
                fee: true,
                commission: false,
                limit: true,
                refresh: true
            }
        };
    },
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    },
    buildList(arr) {
        // label, value, nomenclatureKey
        return arr.map((record, i) => {
            let value = record[2] && this.props.nomenclatures[record[2]] ? this.props.nomenclatures[record[2]][record[1]] : record[1];
            return (
                value
                ? <div key={i}>
                    <b>{record[0] ? record[0] + ': ' : ''}</b>{value}
                </div>
                : null
            );
        });
    },
    clearSelected() {
        this.refs.grid.handleResetCheckedTo(false);
    },
    render() {
        return <SimpleGrid
          ref='grid'
          multiSelect
          fields={[
              {title: 'Priority', name: 'priority'},
              {title: 'Channel', name: 'channel'},
              {title: 'Operation', name: 'operation'},
              {title: 'Source', name: 'source'},
              {title: 'Fee', name: 'fee', style: {padding: '0', position: 'relative', width: '360px', minWidth: '220px'}},
              {title: 'Commission', name: 'commission', style: {padding: '0', position: 'relative', width: '360px', minWidth: '220px'}},
              {title: 'Limit', name: 'limit'},
              {title: <div onClick={this.props.refresh} className={style.refresh} />, name: 'refresh'}
          ].filter((column) => (this.state.columns[column.name]))}
          handleCheckboxSelect={this.props.handleCheckboxSelect}
          handleHeaderCheckboxSelect={this.props.handleHeaderCheckboxSelect}
          externalStyle={style}
          mainClassName='dataGridTable'
          data={Object.keys(this.props.data).map((conditionId, i) => {
              let record = this.props.data[conditionId];
              let condition = record.condition[0];
              let columns = this.state.columns;
              return {
                  id: conditionId,
                  priority: columns.priority && condition.priority,
                  channel: columns.channel && this.buildList([
                      ['Channel', condition.channelId, 'channel'],
                      ['Country', condition.channelCountryId, 'country'],
                      ['Region', condition.channelRegionId, 'region'],
                      ['City', condition.channelCityId, 'city'],
                      ['Organization', condition.channelOrganizationId, 'organization'],
                      ['Supervisor', condition.channelSupervisorId, 'supervisor'],
                      ['Role', condition.channelRoleId, 'role']
                  ]),
                  operation: columns.operation && this.buildList([
                      ['Operation', condition.operationId, 'operation'],
                      ['Start Date', condition.operationStartDate],
                      ['End Date', condition.operationEndDate]
                  ]),
                  source: columns.source && this.buildList([
                      ['Country', condition.sourceCountryId, 'country'],
                      ['Region', condition.sourceRegionId, 'region'],
                      ['City', condition.sourceCityId, 'city'],
                      ['Organization', condition.sourceOrganizationId, 'organization'],
                      ['Supervisor', condition.sourceSupervisorId, 'supervisor'],
                      ['Tag', condition.sourceTag]
                  ]),
                  destination: columns.destination && this.buildList([
                      ['Country', condition.destinationCountryId, 'country'],
                      ['Region', condition.destinationRegionId, 'region'],
                      ['City', condition.destinationCityId, 'city'],
                      ['Organization', condition.destinationOrganizationId, 'organization'],
                      ['Supervisor', condition.destinationSupervisorId, 'supervisor'],
                      ['Tag', condition.destinationTag]
                  ]),
                  fee: columns.fee && record.fee && nestedTable(record.fee.reduce((all, record) => {
                      all.push([
                          '>= ' + record.startAmount + ' ' + record.startAmountCurrency,
                          buildCSV([
                              {
                                  key: '',
                                  value: record.percent ? record.percent + '%' : ''
                              },
                              {
                                  key: 'base',
                                  value: record.percentBase
                              },
                              {
                                  key: 'min',
                                  value: record.minValue
                              },
                              {
                                  key: 'max',
                                  value: record.maxValue
                              }
                          ])
                      ]);
                      return all;
                  }, []), style.fee),
                  commission: columns.commission && record.commission && nestedTable(record.commission.reduce((all, record) => {
                      all.push([
                          '>= ' + record.startAmount + ' ' + record.startAmountCurrency,
                          buildCSV([
                              {
                                  key: '',
                                  value: record.percent ? record.percent + '%' : ''
                              },
                              {
                                  key: 'base',
                                  value: record.percentBase
                              },
                              {
                                  key: 'min',
                                  value: record.minValue
                              },
                              {
                                  key: 'max',
                                  value: record.maxValue
                              }
                          ])
                      ]);
                      return all;
                  }, []), style.commission),
                  limit: columns.limit && record.limit && record.limit.map((limit, i) => {
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
                          ]
                      ]);
                  }),
                  refresh: ''
              };
          })}
        />;
    }
});
