import Dialog from '../ActionDialog';
import React, { PropTypes } from 'react';
import Accordion from 'ut-front-react/components/Accordion';
import Input from 'ut-front-react/components/Input';
import Button from 'ut-front-react/components/StandardButton';
import style from './style.css';
import Channel from './Section/Channel';
import Operation from './Section/Operation';
import Split from './Section/Splits';
import Source from './Section/Source';
import Destination from './Section/Destination';
import SectionLimit from './Section/Limit';
import SectionSummary from './Section/Summary';
import merge from 'lodash.merge';
import validations, {isNumber} from './validations.js';
import set from 'lodash.set';
import {connect} from 'react-redux';
import {checkAccountExists} from '../../pages/Main/actionCreators';
import Promise from 'bluebird';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const emptyCondition = {
    priority: null,
    channelCountryIds: [],
    channelRegionIds: [],
    channelCityIds: [],
    channelOrganizationId: null,
    channelSupervisorId: null,
    channelProperties: [],
    channelRoleId: null,
    channelAgentTypeId: null,
    channelId: null,
    operationIds: [],
    operationTag: null,
    operationStartDate: null,
    operationEndDate: null,
    sourceCountryIds: [],
    sourceRegionIds: [],
    sourceCityIds: [],
    sourceOrganizationId: null,
    sourceSupervisorId: null,
    sourceTag: null,
    sourceId: null,
    sourceCardProductId: null,
    sourceAccountProductId: null,
    sourceAccountId: null,
    destinationCountryIds: [],
    destinationRegionIds: [],
    destinationCityIds: [],
    destinationRoleId: null,
    destinationOrganizationId: null,
    destinationSupervisorId: null,
    destinationTag: null,
    destinationId: null,
    destinationAccountProductId: null,
    destinationAccountId: null
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

const emptyCumulative = {
    currency: null,
    dailyCount: null,
    dailyAmount: null,
    weeklyAmount: null,
    weeklyCount: null,
    mounthlyAmount: null,
    mounthlyCount: null,
    splitRange: []
};

const emptySplit = {
    splitName: {
        name: '',
        tag: [] // varchar -> string with , -> multiselect with hardcoded values
    },
    splitCumulative: [],
    splitAssignment: []
};

const emptyProperty = {
    name: null,
    value: null
};

const emptySplitRange = {
    startAmount: null, // required
    isSourceAmount: false,
    minValue: null,
    maxValue: null,
    percent: null
};

const emptySplitAssignment = {
    debit: null,
    credit: null,
    minValue: null,
    maxValue: null,
    percent: null,
    description: null
};

export default connect(() => ({}), {checkAccountExists})(React.createClass({
    propTypes: {
        open: PropTypes.bool.isRequired,
        data: PropTypes.object,
        conditionProperty: PropTypes.array,
        conditionActor: PropTypes.array,
        conditionItem: PropTypes.array,
        nomenclatures: PropTypes.object.isRequired,
        onSave: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        sections: PropTypes.object
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
                limit: [
                    // Object.assign({}, emptyLimit)
                ],
                split: [

                ],
                channelProperties: [

                ],
                sourceProperties: [

                ],
                destinationProperties: [

                ],
                operationProperties: [

                ]
            },
            sections: this.props.sections
        };
    },
    componentWillMount() {
        var formatedData = {};
        if (this.props.data) {
            let conditionId = this.props.data.condition[0].conditionId;
            let { conditionActor, conditionItem, conditionProperty, nomenclatures } = this.props;
            formatedData = JSON.parse(JSON.stringify(this.props.data));

            if (formatedData.split) {
                formatedData.split.map(s => {
                    s.splitCumulative = [];
                    let identifiers = [];
                    s.splitRange.map(r => {
                        let indentifyObject = {
                            startAmountCurrency: r.startAmountCurrency,
                            startAmountDaily: r.startAmountDaily,
                            startCountDaily: r.startCountDaily
                        };
                        if (!(identifiers.some(item => r.startAmountCurrency === item.startAmountCurrency && r.startAmountDaily === item.startAmountDaily && r.startCountDaily === item.startCountDaily))) {
                            identifiers.push(indentifyObject);
                        }
                    });

                    identifiers.map(identifier => {
                        let cumulativeRanges = s.splitRange.filter(r => {
                            return (
                                r.startAmountCurrency === identifier.startAmountCurrency &&
                                r.startAmountDaily === identifier.startAmountDaily &&
                                r.startCountDaily === identifier.startCountDaily
                            );
                        });

                        s.splitCumulative.push({
                            dailyAmount: isNumber(identifier.startAmountDaily) ? String(identifier.startAmountDaily) : null,
                            dailyCount: isNumber(identifier.startCountDaily) ? String(identifier.startCountDaily) : null,
                            mounthlyAmount: isNumber(cumulativeRanges[0].startAmountMonthly) ? String(cumulativeRanges[0].startAmountMonthly) : null,
                            mounthlyCount: isNumber(cumulativeRanges[0].startCountMonthly) ? String(cumulativeRanges[0].startCountMonthly) : null,
                            weeklyAmount: isNumber(cumulativeRanges[0].startAmountWeekly) ? String(cumulativeRanges[0].startAmountWeekly) : null,
                            weeklyCount: isNumber(cumulativeRanges[0].startCountWeekly) ? String(cumulativeRanges[0].startCountWeekly) : null,
                            currency: identifier.startAmountCurrency,
                            splitRange: cumulativeRanges.map(rr => ({
                                startAmount: isNumber(rr.startAmount) ? String(rr.startAmount) : null, // required
                                isSourceAmount: rr.isSourceAmount,
                                minValue: isNumber(rr.minValue) ? String(rr.minValue) : null,
                                maxValue: isNumber(rr.maxValue) ? String(rr.maxValue) : null,
                                percent: isNumber(rr.percent) ? String(rr.percent) : null
                            }))
                        });
                    });
                });
            }
            conditionActor.forEach((actor) => {
                if (actor.conditionId === conditionId) {
                    switch (actor.factor) {
                        case 'co':
                            formatedData.condition[0][`channel${capitalizeFirstLetter(actor.type)}Id`] = actor.actorId;
                            break;
                        case 'do':
                            formatedData.condition[0][`destination${capitalizeFirstLetter(actor.type)}Id`] = actor.actorId;
                            break;
                        case 'so':
                            formatedData.condition[0][`source${capitalizeFirstLetter(actor.type)}Id`] = actor.actorId;
                            break;
                    }
                }
            });

            formatedData.condition[0]['channelCountryIds'] = [];
            formatedData.condition[0]['channelRegionIds'] = [];
            formatedData.condition[0]['channelCityIds'] = [];
            formatedData.condition[0]['operationIds'] = [];
            formatedData.condition[0]['sourceCountryIds'] = [];
            formatedData.condition[0]['sourceRegionIds'] = [];
            formatedData.condition[0]['sourceCityIds'] = [];
            formatedData.condition[0]['destinationCountryIds'] = [];
            formatedData.condition[0]['destinationRegionIds'] = [];
            formatedData.condition[0]['destinationCityIds'] = [];

            conditionItem.forEach((item) => {
                if (item.conditionId === conditionId) {
                    if (['operation', 'country', 'city', 'region'].indexOf(item.type) > -1) {
                        switch (item.factor) {
                            case 'ds':
                                formatedData.condition[0][`destination${capitalizeFirstLetter(item.type)}Ids`].push({
                                    key: item.itemNameId,
                                    name: nomenclatures[item.type][item.itemNameId]
                                });
                                break;
                            case 'oc':
                                formatedData.condition[0][`operationIds`].push({
                                    key: item.itemNameId,
                                    name: nomenclatures[item.type][item.itemNameId]
                                });
                                break;
                            case 'ss':
                                formatedData.condition[0][`source${capitalizeFirstLetter(item.type)}Ids`].push({
                                    key: item.itemNameId,
                                    name: nomenclatures[item.type][item.itemNameId]
                                });
                                break;
                            case 'cs':
                                formatedData.condition[0][`channel${capitalizeFirstLetter(item.type)}Ids`].push({
                                    key: item.itemNameId,
                                    name: nomenclatures[item.type][item.itemNameId]
                                });
                                break;
                        }
                    } else {
                        switch (item.factor) {
                            case 'ds':
                                formatedData.condition[0][`destinationAccountProductId`] = item.itemNameId;
                                break;
                            case 'ss':
                                if (item.type === 'accountProduct') {
                                    formatedData.condition[0][`sourceAccountProductId`] = item.itemNameId;
                                } else {
                                    formatedData.condition[0][`sourceCardProductId`] = item.itemNameId;
                                }
                        }
                    }
                }
            });

            formatedData.channelProperties = [];
            formatedData.sourceProperties = [];
            formatedData.destinationProperties = [];
            formatedData.operationProperties = [];

            conditionProperty.forEach((property) => {
                if (property.conditionId === conditionId) {
                    switch (property.factor) {
                        case 'co':
                            formatedData.channelProperties.push({
                                name: property.name,
                                value: property.value
                            });
                            break;
                        case 'do':
                            formatedData.destinationProperties.push({
                                name: property.name,
                                value: property.value
                            });
                            break;
                        case 'oc':
                            formatedData.operationProperties.push({
                                name: property.name,
                                value: property.value
                            });
                            break;
                        case 'so':
                            formatedData.sourceProperties.push({
                                name: property.name,
                                value: property.value
                            });
                            break;
                    }
                }
            });
        };
        formatedData.limit && formatedData.limit.map((l, i) => {
            for (let key in l) {
                if (typeof formatedData.limit[i][key] === 'number') {
                    formatedData.limit[i][key] = formatedData.limit[i][key].toString();
                } else if (typeof formatedData.limit[i][key] === 'string') {
                    formatedData.limit[i][key] = formatedData.limit[i][key];
                } else {
                    formatedData.limit[i][key] = '';
                }
            }
        });
        this.setState({
            data: merge({}, this.state.data, formatedData), // here we get the data
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
        let path = [category, index, key].join('.');
        // creating a deep copy, needed for set()
        let data = JSON.parse(JSON.stringify(this.state.data));
        set(data, path, value === '__placeholder__' ? undefined : value);
        this.setState({ data });
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
    addSplitRow() {
        let splitObject = JSON.parse(JSON.stringify(emptySplit));
        this.state.data.split.push(splitObject);
        this.setState({
            data: this.state.data
        });
    },
    addSourcePropertyRow() {
        let propertyObject = JSON.parse(JSON.stringify(emptyProperty));
        this.state.data.sourceProperties.push(propertyObject);
        this.setState({
            data: this.state.data
        });
    },
    addChannelPropertyRow() {
        let propertyObject = JSON.parse(JSON.stringify(emptyProperty));
        this.state.data.channelProperties.push(propertyObject);
        this.setState({
            data: this.state.data
        });
    },
    addDestinationPropertyRow() {
        let propertyObject = JSON.parse(JSON.stringify(emptyProperty));
        this.state.data.destinationProperties.push(propertyObject);
        this.setState({
            data: this.state.data
        });
    },
    addOperationPropertyRow() {
        let propertyObject = JSON.parse(JSON.stringify(emptyProperty));
        this.state.data.operationProperties.push(propertyObject);
        this.setState({
            data: this.state.data
        });
    },
    deleteOperationPropertyRow(index) {
        let { operationProperties } = this.state.data;
        this.state.data.operationProperties = operationProperties.slice(0, index).concat(operationProperties.slice(index + 1));
        this.setState({
            data: this.state.data
        });
    },
    deleteDestinationPropertyRow(index) {
        let { destinationProperties } = this.state.data;
        this.state.data.destinationProperties = destinationProperties.slice(0, index).concat(destinationProperties.slice(index + 1));
        this.setState({
            data: this.state.data
        });
    },
    deleteChannelPropertyRow(index) {
        let { channelProperties } = this.state.data;
        this.state.data.channelProperties = channelProperties.slice(0, index).concat(channelProperties.slice(index + 1));
        this.setState({
            data: this.state.data
        });
    },
    deleteSourcePropertyRow(index) {
        let { sourceProperties } = this.state.data;
        this.state.data.sourceProperties = sourceProperties.slice(0, index).concat(sourceProperties.slice(index + 1));
        this.setState({
            data: this.state.data
        });
    },
    deleteSplitRow(index) {
        let { split } = this.state.data;
        this.state.data.split = split.slice(0, index).concat(split.slice(index + 1));
        this.setState({
            data: this.state.data
        });
    },
    addSplitCumulativeRow(splitIndex) {
        return () => {
            let tempState = Object.assign({}, this.state);
            let splitRow = tempState.data.split[splitIndex];
            splitRow.splitCumulative.push(emptyCumulative);
            this.setState(tempState);
        };
    },
    deleteSplitCumulativeRow(splitIndex, cumulativeIndex) {
        return () => {
            let tempState = Object.assign({}, this.state);
            let splitRow = tempState.data.split[splitIndex];
            splitRow.splitCumulative = splitRow.splitCumulative.slice(0, cumulativeIndex).concat(splitRow.splitCumulative.slice(cumulativeIndex + 1));
            this.setState(tempState);
        };
    },
    addSplitCumulativeRangeRow(splitIndex, cumulativeIndex) {
        return () => {
            let tempState = JSON.parse(JSON.stringify(this.state));
            let cumulativeRow = tempState.data.split[splitIndex].splitCumulative[cumulativeIndex];
            cumulativeRow.splitRange.push(emptySplitRange);
            this.setState(tempState);
        };
    },
    deleteSplitCumulativeRangeRow(splitIndex, cumulativeIndex, randeIndex) {
        let tempState = Object.assign({}, this.state);
        let cumulativeRow = tempState.data.split[splitIndex].splitCumulative[cumulativeIndex];
        cumulativeRow.splitRange = cumulativeRow.splitRange.slice(0, randeIndex).concat(cumulativeRow.splitRange.slice(randeIndex + 1));
        this.setState(tempState);
    },
    addSplitAssignmentRow(splitIndex) {
        return () => {
            let tempState = Object.assign({}, this.state);
            let splitRow = tempState.data.split[splitIndex];
            splitRow.splitAssignment.push(emptySplitAssignment);
            this.setState(tempState);
        };
    },
    deleteSplitAssignmentRow(splitIndex, assignmentIndex) {
        let tempState = Object.assign({}, this.state);
        let splitRow = tempState.data.split[splitIndex];
        splitRow.splitAssignment = splitRow.splitAssignment.slice(0, assignmentIndex).concat(splitRow.splitAssignment.slice(assignmentIndex + 1));
        this.setState(tempState);
    },
    hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    },
    save() {
        const formValidation = validations.run(this.state.data);
        const {data, form} = this.state;

        if (Array.isArray(data.condition) && data.condition.length && (data.condition[0].sourceAccountNumber || data.condition[0].destinationAccountNumber)) {
            const setState = this.setState.bind(this);
            const props = this.props;
            const promiseFunc = data.condition[0].sourceAccountNumber
                ? props.checkAccountExists
                : () => Promise.resolve();

            promiseFunc({accountNumber: data.condition[0].sourceAccountNumber})
            .then(res => {
                if (res && res.error) {
                    formValidation.errors.push(res.error.message + `, ${data.condition[0].sourceAccountNumber}`);
                } else if (res && res.result) {
                    data.condition[0].sourceAccountId = res.result.account.accountId;
                }
                return data.condition[0].destinationAccountNumber
                    ? props.checkAccountExists({accountNumber: data.condition[0].destinationAccountNumber})
                    : Promise.resolve();
            })
            .then(res => {
                if (res && res.error) {
                    formValidation.errors.push(res.error.message + `, ${data.condition[0].destinationAccountNumber}`);
                } else if (res && res.result) {
                    data.condition[0].destinationAccountId = res.result.account.accountId;
                }

                if (formValidation.isValid && !formValidation.errors.length) {
                    props.onSave(data);
                } else {
                    setState({
                        form: Object.assign({}, form, {
                            errorDialogOpen: true,
                            errors: formValidation.errors
                        })
                    });
                }
            });
        } else if (formValidation.isValid) {
            this.props.onSave(this.state.data);
        } else {
            this.setState({
                form: Object.assign({}, this.state.form, {
                    errorDialogOpen: true,
                    errors: formValidation.errors
                })
            });
        }
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
        maxWidth: '85%',
        width: '100%'
    },
    render() {
        let sections = this.state.sections;

        return (
            <Dialog
              title={this.props.data ? 'Edit Rule' : 'Add Rule'}
              open={this.props.open}
              autoScrollBodyContent
              contentStyle={this.contentStyle}
              actions={[
                  <Button label={'Save'} onClick={this.save} styleType='primaryLight' className={style.save} />,
                  <Button label={'Cancel'} onClick={this.props.onClose} styleType='secondaryDark' />
              ]}
            >
                <div>
                  <Dialog
                    title='Error'
                    open={this.state.form.errorDialogOpen}
                    autoScrollBodyContent
                    contentStyle={style}
                    onRequestClose={this.closeFormErrorDialog}
                    actions={[
                        <Button label={'Cancel'} onClick={this.closeFormErrorDialog} styleType='secondaryDark' />
                    ]}
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
                        {sections.channel.visible &&
                          <Accordion title={sections.channel.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body} >
                            <Channel
                              data={this.state.data.condition[0]}
                              fields={sections.channel.fields}
                              properties={this.state.data.channelProperties}
                              addPropertyRow={this.addChannelPropertyRow}
                              deletePropetyRow={this.deleteChannelPropertyRow}
                            />
                          </Accordion>
                        }
                        {sections.operation.visible &&
                          <Accordion title={sections.operation.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <Operation
                              data={this.state.data.condition[0]}
                              fields={sections.operation.fields}
                              properties={this.state.data.operationProperties}
                              addPropertyRow={this.addOperationPropertyRow}
                              deletePropetyRow={this.deleteOperationPropertyRow}
                            />
                          </Accordion>}
                        {sections.source.visible &&
                          <Accordion title={sections.source.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <Source
                              data={this.state.data.condition[0]}
                              fields={sections.source.fields}
                              properties={this.state.data.sourceProperties}
                              addPropertyRow={this.addSourcePropertyRow}
                              deletePropetyRow={this.deleteSourcePropertyRow}
                            />
                          </Accordion>}
                        {sections.destination.visible &&
                          <Accordion title={sections.destination.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <Destination
                              data={this.state.data.condition[0]}
                              fields={sections.destination.fields}
                              properties={this.state.data.destinationProperties}
                              addPropertyRow={this.addDestinationPropertyRow}
                              deletePropetyRow={this.deleteDestinationPropertyRow}
                            />
                          </Accordion>}
                        {sections.limit.visible &&
                          <Accordion title={sections.limit.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <div className={style.content}>
                              <SectionLimit
                                data={this.state.data.limit}
                                addRow={this.addLimitRow}
                                deleteRow={this.deleteLimitRow}
                              />
                            </div>
                          </Accordion>}
                        {sections.split.visible &&
                          <Accordion title={sections.split.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <div className={style.content}>
                              <Split
                                data={this.state.data.split}
                                nomenclatures={this.props.nomenclatures}
                                addSplitRow={this.addSplitRow}
                                deleteSplitRow={this.deleteSplitRow}
                                addSplitCumulativeRow={this.addSplitCumulativeRow}
                                deleteSplitCumulativeRow={this.deleteSplitCumulativeRow}
                                addSplitCumulativeRangeRow={this.addSplitCumulativeRangeRow}
                                deleteSplitCumulativeRangeRow={this.deleteSplitCumulativeRangeRow}
                                addSplitAssignmentRow={this.addSplitAssignmentRow}
                                deleteSplitAssignmentRow={this.deleteSplitAssignmentRow}
                                config={sections.split}
                              />
                            </div>
                          </Accordion>}
                        {sections.summary.visible &&
                          <Accordion title={sections.summary.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <div className={style.content}>
                              <SectionSummary
                                data={this.state.data}
                                nomenclatures={this.props.nomenclatures}
                              />
                            </div>
                          </Accordion>}
                  </div>
                </div>
            </Dialog>
        );
    }
}));
