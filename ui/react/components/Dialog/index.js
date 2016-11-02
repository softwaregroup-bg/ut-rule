import Dialog from 'material-ui/Dialog';
import React, { PropTypes } from 'react';
import Accordion from 'ut-front-react/components/Accordion';
// import { validationTypes, textValidations, arrayValidations, dropdownValidations } from 'ut-front-react/validator/constants.js';
import style from './style.css';
import Channel from './Section/Channel';
import Operation from './Section/Operation';
import Source from './Section/Source';
import Destination from './Section/Destination';
import SectionFee from './Section/Fee';
import SectionLimit from './Section/Limit';

// var validations = {
//     ruleTypeId: [
//         { type: textValidations.isRequired, errorMessage: 'Rule Type is required' }
//     ],
//     organization: [
//         { type: textValidations.length, minVal: 3, maxVal: 5, errorMessage: 'organization should be between 3 and 5 symbols long' }
//     ]
// };

const emptyCondition = {
    priority: null,
    channelCountryId: null,
    channelRegionId: null,
    channelCityId: null,
    channelOrganizationId: null,
    channelSupervisorId: null,
    channelTag: null,
    channelRoleId: null,
    channelId: null,
    operationId: null,
    operationTag: null,
    operationStartDate: null,
    operationEndDate: null,
    sourceCountryId: null,
    sourceRegionId: null,
    sourceCityId: null,
    sourceOrganizationId: null,
    sourceSupervisorId: null,
    sourceTag: null,
    sourceId: null,
    sourceProductId: null,
    sourceAccountId: null,
    destinationCountryId: null,
    destinationRegionId: null,
    destinationCityId: null,
    destinationOrganizationId: null,
    destinationSupervisorId: null,
    destinationTag: null,
    destinationId: null,
    destinationProductId: null,
    destinationAccountId: null
};
const emptyFee = {
    startAmount: null,
    startAmountCurrency: null,
    isSourceAmount: true,
    minValue: null,
    maxValue: null,
    percent: null,
    percentBase: null
};
const emptyLimit = {
    currency: null,
    minAmount: null,
    maxAmount: null,
    maxAmountDaily: null,
    maxCountDaily: null,
    maxAmountWeekly: null,
    maxCountWeekly: null,
    maxAmountMonthly: null,
    maxCountMonthly: null
};

// const emptyCommission = {
//     commissionId: null,
//     startAmount: null,
//     startAmountCurrency: null,
//     isSourceAmount: null,
//     minValue: null,
//     maxValue: null,
//     percent: null,
//     percentBase: null
// };

export default React.createClass({
    propTypes: {
        open: PropTypes.bool.isRequired,
        data: PropTypes.object,
        nomenclatures: PropTypes.object.isRequired,
        onSave: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    },
    childContextTypes: {
        onFieldChange: PropTypes.func
    },
    getInitialState() {
        return {
            errors: {},
            nomenclatures: {},
            data: {
                condition: [
                    Object.assign({}, emptyCondition)
                ],
                fee: [
                    Object.assign({}, emptyFee)
                ],
                limit: [
                    Object.assign({}, emptyLimit)
                ],
                commission: [
                    // Object.assign({}, emptyCommission)
                ]
            }
        };
    },
    componentWillMount() {
        let { nomenclatures } = this.props;
        let formattedNomenclatures = {};
        Object.keys(nomenclatures).map((nomKey) => {
            formattedNomenclatures[nomKey] = Object.keys(nomenclatures[nomKey]).map((key) => {
                return {
                    key,
                    name: nomenclatures[nomKey][key]
                };
            });
        });
        this.setState({
            nomenclatures: formattedNomenclatures,
            data: Object.assign({}, this.state.data, this.props.data)
        });
    },
    getChildContext() {
        return {
            onFieldChange: this.onFieldChange
        };
    },
    onFieldChange(category, index, key, value) {
        let data = this.state.data;
        data[category][index][key] = value;
        this.setState({ data });
    },
    addFeeRow() {
        this.state.data.fee.push(Object.assign({}, emptyFee));
        this.setState({
            data: this.state.data
        });
    },
    addLimitRow() {
        this.state.data.limit.push(Object.assign({}, emptyLimit));
        this.setState({
            data: this.state.data
        });
    },
    save() {
        this.props.onSave(this.state.data);
    },
    render() {
        return (
            <Dialog
              title={this.props.data ? 'Edit Rule' : 'Add Rule'}
              open={this.props.open}
              autoScrollBodyContent
              contentStyle={style}
              actions={[
                  <button onClick={this.save} style={{ marginRight: '10px' }}>Save</button>,
                  <button onClick={this.props.onClose}>Cancel</button>
              ]}
            >
                <div>
                    <div className={style.topSection}>
                        Status
                    </div>
                    <div className={style.wrapper}>
                        <Accordion title='Channel' fullWidth>
                            <Channel
                              nomenclatures={this.state.nomenclatures}
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Operation' fullWidth>
                            <Operation
                              nomenclatures={this.state.nomenclatures}
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Source' fullWidth>
                            <Source
                              nomenclatures={this.state.nomenclatures}
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Destination' fullWidth>
                            <Destination
                              nomenclatures={this.state.nomenclatures}
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Fee' fullWidth>
                            <div className={style.content}>
                                <SectionFee
                                  nomenclatures={this.state.nomenclatures}
                                  data={this.state.data.fee}
                                  addFeeRow={this.addFeeRow}
                                />
                            </div>
                        </Accordion>
                        <Accordion title='Limit' fullWidth>
                            <div className={style.content}>
                                <SectionLimit
                                  nomenclatures={this.state.nomenclatures}
                                  data={this.state.data.limit}
                                  addLimitRow={this.addLimitRow}
                                />
                            </div>
                        </Accordion>
                        <Accordion title='Summary' fullWidth>
                            <div className={style.content}>
                                TODO Summary
                            </div>
                        </Accordion>
                    </div>
                </div>
            </Dialog>
        );
    }
});
