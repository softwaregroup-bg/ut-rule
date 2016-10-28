import React, { PropTypes } from 'react';
import style from './style.css';

export default React.createClass({
    propTypes: {
        data: PropTypes.array,
        nomenclatures: PropTypes.object
    },
    buildList(arr) {
        // label, value, nomenclatureKey
        return arr.map((record, i) => {
            let value = record[2] && this.props.nomenclatures[record[2]] ? this.props.nomenclatures[record[2]][record[1]] : record[1];
            return (
                value
                ? <div key={i}>
                    <b>{record[0]}: </b>{value}
                </div>
                : null
            );
        });
    },
    render() {
        return (
            <div className={style.wrapper}>
                <table >
                    <thead>
                        <tr>
                            <th><input type='checkbox' name='all' /></th>
                            <th>Priority</th>
                            <th>Channel</th>
                            <th>Operation</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Amount</th>
                            <th>Fee</th>
                            <th>Limit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.data.map((record, i) => {
                                let condition = record.condition[0];
                                return (
                                    <tr key={condition.conditionId}>
                                        <td>
                                            <input type='checkbox' name={condition.conditionId} value={condition.conditionId} />
                                        </td>
                                        <td>
                                            {condition.priority}
                                        </td>
                                        <td>
                                            {
                                                this.buildList([
                                                    ['Channel', condition.channelId, 'channel'],
                                                    ['Country', condition.channelCountryId, 'country'],
                                                    ['Region', condition.channelRegionId, 'region'],
                                                    ['City', condition.channelCityId, 'city'],
                                                    ['Organization', condition.channelOrganizationId, 'organization'],
                                                    ['Supervisor', condition.channelSupervisorId, 'supervisor'],
                                                    ['Role', condition.channelRoleId, 'role']
                                                ])
                                            }
                                        </td>
                                        <td>
                                            {
                                                this.buildList([
                                                    ['Operation', condition.operationId, 'operation'],
                                                    ['Start Date', condition.operationStartDate],
                                                    ['End Date', condition.operationEndDate]
                                                ])
                                            }
                                        </td>
                                        <td>
                                            {
                                                this.buildList([
                                                    ['Country', condition.sourceCountryId, 'country'],
                                                    ['Region', condition.sourceRegionId, 'region'],
                                                    ['City', condition.sourceCityId, 'city'],
                                                    ['Organization', condition.sourceOrganizationId, 'organization'],
                                                    ['Supervisor', condition.sourceSupervisorId, 'supervisor']
                                                ])
                                            }
                                        </td>
                                        <td>
                                            {
                                                this.buildList([
                                                    ['Country', condition.destinationCountryId, 'country'],
                                                    ['Region', condition.destinationRegionId, 'region'],
                                                    ['City', condition.destinationCityId, 'city'],
                                                    ['Organization', condition.destinationOrganizationId, 'organization'],
                                                    ['Supervisor', condition.destinationSupervisorId, 'supervisor']
                                                ])
                                            }
                                        </td>
                                        <td>
                                            Amount
                                        </td>
                                        <td>
                                            Fee
                                        </td>
                                        <td>
                                            {
                                                this.buildList([
                                                    ['Transaction', 'max 400 USD min 10 USD']
                                                ])
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
});
