import React, { PropTypes } from 'react';
import style from './style.css';

const Summary = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired,
        nomenclatures: PropTypes.object.isRequired
    },
    buildList(arr, heading) {
        // label, value, nomenclatureKey
        var list = arr.map((record, i) => {
            let value = record[2] && this.props.nomenclatures[record[2]] ? this.props.nomenclatures[record[2]][record[1]] : record[1];
            return (
                value
                ? <div key={i + 2}>
                    <b>{record[0] ? record[0] + ': ' : ''}</b>{value}
                </div>
                : null
            );
        }).filter(val => val);
        if (list.length) {
            if (heading) {
                list.unshift(<div key={1} className={style.heading}>{heading}</div>);
            }
            return list;
        }
        return null;
    },
    buildCSV(arr, label, key) {
        return <div key={key}>
            <b>{label}: </b>
            {
                arr.map((record) => {
                    return record.value ? ((record.key ? record.key + ': ' : '') + record.value) : '';
                }).filter(val => val).join(' | ')
            }
        </div>;
    },
    render() {
        let condition = this.props.data.condition[0];
        let fee = this.props.data.fee;
        let limit = this.props.data.limit;
        let commission = this.props.data.commission;
        return (
           <table className={style.summary}>
                <tbody>
                    <tr>
                        <td>
                            {this.buildList([
                                ['Channel', condition.channelId, 'channel'],
                                ['Tag', condition.channelTag],
                                ['Country', condition.channelCountryId, 'country'],
                                ['Region', condition.channelRegionId, 'region'],
                                ['City', condition.channelCityId, 'city'],
                                ['Organization', condition.channelOrganizationId, 'organization'],
                                ['Supervisor', condition.channelSupervisorId, 'supervisor'],
                                ['Role', condition.channelRoleId, 'role']
                            ], 'Condition')}
                            {this.buildList([
                                ['Operation', condition.operationId, 'operation'],
                                ['Tag', condition.operationTag],
                                ['Start Date', condition.operationStartDate],
                                ['End Date', condition.operationEndDate]
                            ], 'Operation')}
                            {this.buildList([
                                ['Country', condition.sourceCountryId, 'country'],
                                ['Region', condition.sourceRegionId, 'region'],
                                ['City', condition.sourceCityId, 'city'],
                                ['Organization', condition.sourceOrganizationId, 'organization'],
                                ['Supervisor', condition.sourceSupervisorId, 'supervisor'],
                                ['Tag', condition.sourceTag]
                            ], 'Source')}
                            {this.buildList([
                                ['Country', condition.destinationCountryId, 'country'],
                                ['Region', condition.destinationRegionId, 'region'],
                                ['City', condition.destinationCityId, 'city'],
                                ['Organization', condition.destinationOrganizationId, 'organization'],
                                ['Supervisor', condition.destinationSupervisorId, 'supervisor'],
                                ['Tag', condition.destinationTag]
                            ], 'Destination')}
                        </td>
                        <td>
                            {
                                limit.length > 0 && [<div key={0} className={style.heading}>Limits</div>].concat(limit.map((item, i) => {
                                    return this.buildList([
                                        [
                                            '',
                                            i === 0 ? null : <hr />
                                        ],
                                        [
                                            'Currency',
                                            item.currency || ''
                                        ],
                                        [
                                            'Transaction',
                                            '' + (item.maxAmount ? 'max ' + item.maxAmount + ' ' : '') + (item.minAmount ? 'min ' + item.minAmount + ' ' : '')
                                        ],
                                        [
                                            'Daily',
                                            '' + (item.maxAmountDaily ? 'max ' + item.maxAmountDaily + ' ' : '') + (item.maxCountDaily ? 'count ' + item.maxCountDaily + ' ' : '')
                                        ],
                                        [
                                            'Weekly',
                                            '' + (item.maxAmountWeekly ? 'max ' + item.maxAmountWeekly + ' ' : '') + (item.maxCountWeekly ? 'count ' + item.maxCountWeekly + ' ' : '')
                                        ],
                                        [
                                            'Monthly',
                                            '' + (item.maxAmountMonthly ? 'max ' + item.maxAmountMonthly + ' ' : '') + (item.maxCountMonthly ? 'count ' + item.maxCountMonthly + ' ' : '')
                                        ]
                                    ]);
                                }))
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
});

export default Summary;
