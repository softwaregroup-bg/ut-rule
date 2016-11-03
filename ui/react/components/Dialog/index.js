import Dialog from 'material-ui/Dialog';
import React, { PropTypes } from 'react';
import Accordion from 'ut-front-react/components/Accordion';
import Input from 'ut-front-react/components/Input';
import style from './style.css';
import Channel from './Section/Channel';
import Operation from './Section/Operation';
import Source from './Section/Source';
import Destination from './Section/Destination';
import SectionFee from './Section/Fee';
import SectionLimit from './Section/Limit';
import merge from 'lodash.merge';

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

export default React.createClass({
    propTypes: {
        open: PropTypes.bool.isRequired,
        data: PropTypes.object,
        nomenclatures: PropTypes.object.isRequired,
        onSave: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    },
    childContextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object
    },
    getInitialState() {
        return {
            data: {
                condition: [
                    Object.assign({}, emptyCondition)
                ],
                fee: [
                    // Object.assign({}, emptyFee)
                ],
                limit: [
                    // Object.assign({}, emptyLimit)
                ],
                commission: []
            }
        };
    },
    componentWillMount() {
        this.setState({
            data: merge({}, this.state.data, this.props.data),
            isEditing: this.props.data !== undefined
        });
    },
    getChildContext() {
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
        return {
            onFieldChange: this.onFieldChange,
            nomenclatures: formattedNomenclatures
        };
    },
    onFieldChange(category, index, key, value) {
        let data = this.state.data;
        data[category][index][key] = value;
        this.setState({ data });
    },
    addFeeRow() {
        let feeObject = Object.assign({}, emptyFee);
        if (this.state.isEditing) {
            feeObject.conditionId = this.state.data.condition[0].conditionId;
        }
        this.state.data.fee.push(feeObject);
        this.setState({
            data: this.state.data
        });
    },
    addLimitRow() {
        let limitObject = Object.assign({}, emptyLimit);
        if (this.state.isEditing) {
            limitObject.conditionId = this.state.data.condition[0].conditionId;
        }
        this.state.data.limit.push(limitObject);
        this.setState({
            data: this.state.data
        });
    },
    deleteFeeRow(index) {
        let fee = this.state.data.fee;
        this.state.data.fee = fee.slice(0, index).concat(fee.slice(index + 1));
        this.setState({
            data: this.state.data
        });
    },
    deleteLimitRow(index) {
        let limit = this.state.data.limit;
        this.state.data.limit = limit.slice(0, index).concat(limit.slice(index + 1));
        this.setState({
            data: this.state.data
        });
    },
    save() {
        this.props.onSave(this.state.data);
    },
    onChangeInput(field) {
        this.onFieldChange('condition', 0, field.key, field.value);
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
                        <Input
                          keyProp='priority'
                          label='Priority'
                          onChange={this.onChangeInput}
                          value={'' + (this.state.data.condition[0].priority || '')}
                        />
                    </div>
                    <div className={style.wrapper}>
                        <Accordion title='Channel' fullWidth>
                            <Channel
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Operation' fullWidth>
                            <Operation
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Source' fullWidth>
                            <Source
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Destination' fullWidth>
                            <Destination
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Fee' fullWidth>
                            <div className={style.content}>
                                <SectionFee
                                  data={this.state.data.fee}
                                  addFeeRow={this.addFeeRow}
                                  deleteFeeRow={this.deleteFeeRow}
                                />
                            </div>
                        </Accordion>
                        <Accordion title='Limit' fullWidth>
                            <div className={style.content}>
                                <SectionLimit
                                  data={this.state.data.limit}
                                  addLimitRow={this.addLimitRow}
                                  deleteLimitRow={this.deleteLimitRow}
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
