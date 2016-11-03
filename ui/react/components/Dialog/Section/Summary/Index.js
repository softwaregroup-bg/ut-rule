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
                ? <div key={i + 1}>
                    {(record[0] ? record[0] + ': ' : '') + value}
                </div>
                : null
            );
        }).filter(val => val);
        if (list.length) {
            list.unshift(<div key={0} className={style.heading}>{heading}</div>);
            return list;
        }
        return null;
    },
    buildCSV(arr) {
        return arr.map((record) => {
            return record.value ? ((record.key ? record.key + ': ' : '') + record.value) : '';
        }).filter(val => val).join(', ');
    },
    render() {
        let condition = this.props.data.condition[0];
        return (
           <table className={style.summary}>
                <tbody>
                    <tr>
                        <td>
                            {this.buildList([
                                ['Channel', condition.channelId, 'channel'],
                                ['Country', condition.channelCountryId, 'country'],
                                ['Region', condition.channelRegionId, 'region'],
                                ['City', condition.channelCityId, 'city'],
                                ['Organization', condition.channelOrganizationId, 'organization'],
                                ['Supervisor', condition.channelSupervisorId, 'supervisor'],
                                ['Role', condition.channelRoleId, 'role']
                            ], 'Condition')}
                        </td>
                        <td rowSpan='4'>
                            <div className={style.heading}>
                                Fees
                            </div>
                        </td>
                        <td rowSpan='4'>
                            <div className={style.heading}>
                                Commissions
                            </div>
                        </td>
                        <td rowSpan='4'>
                            <div className={style.heading}>
                                Limits
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {
                                this.buildList([
                                    ['Operation', condition.operationId, 'operation'],
                                    ['Start Date', condition.operationStartDate],
                                    ['End Date', condition.operationEndDate]
                                ], 'Operation')
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {
                                this.buildList([
                                    ['Country', condition.sourceCountryId, 'country'],
                                    ['Region', condition.sourceRegionId, 'region'],
                                    ['City', condition.sourceCityId, 'city'],
                                    ['Organization', condition.sourceOrganizationId, 'organization'],
                                    ['Supervisor', condition.sourceSupervisorId, 'supervisor'],
                                    ['Tag', condition.sourceTag]
                                ], 'Source')
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {
                                this.buildList([
                                    ['Country', condition.destinationCountryId, 'country'],
                                    ['Region', condition.destinationRegionId, 'region'],
                                    ['City', condition.destinationCityId, 'city'],
                                    ['Organization', condition.destinationOrganizationId, 'organization'],
                                    ['Supervisor', condition.destinationSupervisorId, 'supervisor'],
                                    ['Tag', condition.destinationTag]
                                ], 'Destination')
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
});

export default Summary;
