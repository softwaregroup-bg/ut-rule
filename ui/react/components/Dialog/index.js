import Dialog from '../ActionDialog';
import React, { PropTypes } from 'react';
import Accordion from 'ut-front-react/components/Accordion';
import Input from 'ut-front-react/components/Input';
import style from './style.css';
import Channel from './Section/Channel';
import Operation from './Section/Operation';
import Source from './Section/Source';
import Destination from './Section/Destination';
import SectionFee from './Section/Fee';
import SectionCommission from './Section/Commission';
import SectionLimit from './Section/Limit';
import SectionSummary from './Section/Summary';
import merge from 'lodash.merge';
import validations from './validations.js';
import classnames from 'classnames';

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
    sourceCardProductId: null,
    sourceAccountProductId: null,
    sourceAccountId: null,
    destinationCountryId: null,
    destinationRegionId: null,
    destinationCityId: null,
    destinationOrganizationId: null,
    destinationSupervisorId: null,
    destinationTag: null,
    destinationId: null,
    destinationAccountProductId: null,
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
const emptyCommission = {
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
            form: {
                errors: [],
                errorDialogOpen: false
            },
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
        data[category][index][key] = value === '__placeholder__' ? undefined : value;
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
    deleteFeeRow(index) {
        let fee = this.state.data.fee;
        this.state.data.fee = fee.slice(0, index).concat(fee.slice(index + 1));
        this.setState({
            data: this.state.data
        });
    },
    addCommissionRow() {
        let commissionObject = Object.assign({}, emptyCommission);
        if (this.state.isEditing) {
            commissionObject.conditionId = this.state.data.condition[0].conditionId;
        }
        this.state.data.commission.push(commissionObject);
        this.setState({
            data: this.state.data
        });
    },
    deleteCommissionRow(index) {
        let commission = this.state.data.commission;
        this.state.data.commission = commission.slice(0, index).concat(commission.slice(index + 1));
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
    deleteLimitRow(index) {
        let limit = this.state.data.limit;
        this.state.data.limit = limit.slice(0, index).concat(limit.slice(index + 1));
        this.setState({
            data: this.state.data
        });
    },
    save() {
        let formValidation = validations.run(this.state.data);
        if (formValidation.isValid) {
            this.props.onSave(this.state.data);
        }

        this.setState({
            form: Object.assign({}, this.state.form, {
                errorDialogOpen: true,
                errors: formValidation.errors
            })
        });
    },
    onChangeInput(field) {
        this.onFieldChange('condition', 0, field.key, field.value);
    },
    closeFormErrorDialog() {
        this.state.form.errorDialogOpen = false;
        this.setState({
            form: this.state.form
        });
    },
    contentStyle: {
        minWidth: '730px',
        maxWidth: '50%'
    },
    render() {
        return (
            <Dialog
              title={this.props.data ? 'Edit Rule' : 'Add Rule'}
              open={this.props.open}
              autoScrollBodyContent
              contentStyle={this.contentStyle}
              actions={[
                  <button onClick={this.save} className={classnames(style.save, 'button btn btn-primary')} >Save</button>,
                  <button onClick={this.props.onClose} className='button btn btn-primary'>Cancel</button>
              ]}
            >
                <div>
                    <Dialog
                      title='Error'
                      open={this.state.form.errorDialogOpen}
                      autoScrollBodyContent
                      contentStyle={style}
                      onRequestClose={this.closeFormErrorDialog}
                      actions={[]}
                    >
                        <div className={style.content}>
                            {this.state.form.errors && this.state.form.errors.map((error, i) => <div key={i}>{error}</div>)}
                        </div>
                    </Dialog>
                    <div className={style.topSection}>
                        <Input
                          keyProp='priority'
                          label='Priority'
                          onChange={this.onChangeInput}
                          value={'' + (this.state.data.condition[0].priority || '')}
                        />
                    </div>
                    <div className={style.wrapper}>
                        <Accordion title='Channel' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body} >
                            <Channel
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Operation' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <Operation
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Source' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <Source
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Destination' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <Destination
                              data={this.state.data.condition[0]}
                            />
                        </Accordion>
                        <Accordion title='Fee' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <div className={style.content}>
                                <SectionFee
                                  data={this.state.data.fee}
                                  addRow={this.addFeeRow}
                                  deleteRow={this.deleteFeeRow}
                                />
                            </div>
                        </Accordion>
                        <Accordion title='Commission' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <div className={style.content}>
                                <SectionCommission
                                  data={this.state.data.commission}
                                  addRow={this.addCommissionRow}
                                  deleteRow={this.deleteCommissionRow}
                                />
                            </div>
                        </Accordion>
                        <Accordion title='Limit' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <div className={style.content}>
                                <SectionLimit
                                  data={this.state.data.limit}
                                  addRow={this.addLimitRow}
                                  deleteRow={this.deleteLimitRow}
                                />
                            </div>
                        </Accordion>
                        <Accordion title='Summary' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <div className={style.content}>
                                <SectionSummary
                                  data={this.state.data}
                                  nomenclatures={this.props.nomenclatures}
                                />
                            </div>
                        </Accordion>
                    </div>
                </div>
            </Dialog>
        );
    }
});
