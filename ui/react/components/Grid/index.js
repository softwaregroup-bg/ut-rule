import React, { PropTypes } from 'react';
import {SimpleGrid} from 'ut-front-react/components/SimpleGrid';
// import style from './style.css';

export default React.createClass({
    propTypes: {
        data: PropTypes.object,
        nomenclatures: PropTypes.object,
        handleCheckboxSelect: PropTypes.func,
        handleHeaderCheckboxSelect: PropTypes.func
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
                    <b>{record[0]}: </b>{value}
                </div>
                : null
            );
        });
    },
    render() {
        console.info('RULES GRID RENDERED...');
        debugger;
        return <SimpleGrid
            multiSelect
            fields={[
                {title: 'Priority', name: 'priority'},
                {title: 'Channel', name: 'channel'},
                {title: 'Operation', name: 'operation'},
                {title: 'Source', name: 'source'},
                {title: 'Destination', name: 'destination'},
                {title: 'Amount', name: 'amount'},
                {title: 'Fee', name: 'fee'},
                {title: 'Limit', name: 'limit'}
            ]}
            handleCheckboxSelect={this.props.handleCheckboxSelect}
            handleHeaderCheckboxSelect={this.props.handleHeaderCheckboxSelect}
            data={Object.keys(this.props.data).map((conditionId, i) => {
                let record = this.props.data[conditionId];
                let condition = record.condition[0];
                let fees = record.fee;
                let commissions = record.commission;
                let limits = record.limit;
                debugger;
                return {
                    id: conditionId,
                    priority: condition.priority,
                    channel: this.buildList([
                        ['Channel', condition.channelId, 'channel'],
                        ['Country', condition.channelCountryId, 'country'],
                        ['Region', condition.channelRegionId, 'region'],
                        ['City', condition.channelCityId, 'city'],
                        ['Organization', condition.channelOrganizationId, 'organization'],
                        ['Supervisor', condition.channelSupervisorId, 'supervisor'],
                        ['Role', condition.channelRoleId, 'role']
                    ]),
                    operation: this.buildList([
                        ['Operation', condition.operationId, 'operation'],
                        ['Start Date', condition.operationStartDate],
                        ['End Date', condition.operationEndDate]
                    ]),
                    source: this.buildList([
                        ['Country', condition.sourceCountryId, 'country'],
                        ['Region', condition.sourceRegionId, 'region'],
                        ['City', condition.sourceCityId, 'city'],
                        ['Organization', condition.sourceOrganizationId, 'organization'],
                        ['Supervisor', condition.sourceSupervisorId, 'supervisor']
                    ]),
                    destination: this.buildList([
                        ['Country', condition.destinationCountryId, 'country'],
                        ['Region', condition.destinationRegionId, 'region'],
                        ['City', condition.destinationCityId, 'city'],
                        ['Organization', condition.destinationOrganizationId, 'organization'],
                        ['Supervisor', condition.destinationSupervisorId, 'supervisor']
                    ]),
                    amount: 'Amount',
                    fee: 'Fee',
                    limit: this.buildList([
                        ['Transaction', 'max 400 USD min 10 USD']
                    ])
                };
            })}
        />;
    }
});
