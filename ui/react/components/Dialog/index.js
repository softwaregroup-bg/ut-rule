import Dialog from '../ActionDialog';
import React, { PropTypes } from 'react';
import Accordion from 'ut-front-react/components/Accordion';
import Input from 'ut-front-react/components/Input';
import style from './style.css';
import Channel from './Section/Channel';
import Operation from './Section/Operation';
import Split from './Section/Splits';
// import Source from './Section/Source';
// import Destination from './Section/Destination';
import SectionLimit from './Section/Limit';
import SectionSummary from './Section/Summary';
// import SectionLimitPerEntry from './Section/LimitPerEntry';
// import HowToUse from './Section/HowToUse';
import merge from 'lodash.merge';
import validations from './validations.js';
import classnames from 'classnames';
import set from 'lodash.set';

import TabContainer from 'ut-front-react/components/TabContainer';

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
    operationTag: [],
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
const emptyLimit = {
    currency: null,
    minAmount: null,
    maxAmount: null,
    maxAmountDaily: null,
    maxCountDaily: null,
    maxAmountWeekly: null,
    maxCountWeekly: null,
    maxAmountMonthly: null,
    maxCountMonthly: null,
    // Lifetime
    maxAmountLifetime: null,
    maxCountLifetime: null
};

const emptyLimitPerEntry = {
    currency: null,
    minAmount: null,
    maxAmount: null,
    maxAmountDaily: null,
    maxCountDaily: null
};

const emptySplit = {
    splitName: {
        name: '',
        tag: [] // varchar -> string with , -> multiselect with hardcoded values
    },
    splitRange: [],
    splitAssignment: []
};

const emptySplitRange = {
    startAmount: null, // required
    startAmountCurrency: null, // required
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

export default React.createClass({
    propTypes: {
        open: PropTypes.bool.isRequired,
        data: PropTypes.object,
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
                limitPerEntry: [
                    // Object.assign({}, emptyLimitPerEntry)
                ],
                split: [

                ]
            },
            sections: this.props.sections
        };
    },
    componentWillMount() {
        this.setState({
            data: merge({}, this.state.data, this.props.data), // here we get the data
            isEditing: this.props.data !== undefined
        });
    },
    getChildContext() {
        let {nomenclatures} = this.props;
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

    addLimitPerEntryRow() {
        let limitObject = Object.assign({}, emptyLimitPerEntry);
        if (this.state.isEditing) {
            limitObject.conditionId = this.state.data.condition[0].conditionId;
        }
        this.state.data.limitPerEntry.push(limitObject);

        this.setState({
            data: this.state.data
        });
    },
    deleteLimitPerEntryRow(index) {
        let limit = this.state.data.limitPerEntry;
        this.state.data.limitPerEntry = limit.slice(0, index).concat(limit.slice(index + 1));
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
    deleteSplitRow(index) {
        let {split} = this.state.data;
        this.state.data.split = split.slice(0, index).concat(split.slice(index + 1));
        this.setState({
            data: this.state.data
        });
    },
    addSplitRangeRow(splitIndex) {
        return () => {
            let tempState = Object.assign({}, this.state);
            let splitRow = tempState.data.split[splitIndex];
            splitRow.splitRange.push(emptySplitRange);
            this.setState(tempState);
        };
    },
    deleteSplitRangeRow(splitIndex, rangeIndex) {
        let tempState = Object.assign({}, this.state);
        let splitRow = tempState.data.split[splitIndex];
        splitRow.splitRange = splitRow.splitRange.slice(0, rangeIndex).concat(splitRow.splitRange.slice(rangeIndex + 1));
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
    save() {
        let formValidation = validations.run(this.state.data);
        if (formValidation.isValid) {
            this.props.onSave(JSON.parse(JSON.stringify(this.state.data)));
        }
        this.setState({
            form: Object.assign({}, this.state.form, {
                errorDialogOpen: !formValidation.isValid,
                errors: formValidation.errors
            })
        });
    },
    onChangeInput(field) {
        if (field && field.value && field.value.trim) {
            field.value = field.value.trim();
        }
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
        maxWidth: '85%'
    },
    render() {
        let sections = this.state.sections;
        let empty = () => {};

        const tabs = [
            // {
            //     title: 'How To Use',
            //     component: (
            //         <div key='1' style={{padding: '20px'}}>
            //             <HowToUse />
            //         </div>
            //     ),
            //     validations: []
            // },
            {
                title: 'Channel',
                component: (
                    <Accordion key='2' onToggle={empty} title={sections.channel.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body} >
                        <Channel
                          data={this.state.data.condition[0]}
                          fields={sections.channel.fields}
                        />
                    </Accordion>
                ),
                validations: []
            },
            {
                title: 'Operation',
                component: (
                    <Accordion key='3' onToggle={empty} title={sections.operation.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body} >
                        <Operation
                          data={this.state.data.condition[0]}
                          fields={sections.operation.fields}
                        />
                    </Accordion>
                ),
                validations: []
            },
            // {
            //     title: 'Source',
            //     component: (
            //         <Source
            //           data={this.state.data.condition[0]}
            //           fields={sections.source.fields}
            //         />
            //     ),
            //     validations: []
            // },
            // {
            //     title: 'Destination',
            //     component: (
            //         <Destination
            //           data={this.state.data.condition[0]}
            //           fields={sections.destination.fields}
            //         />
            //     ),
            //     validations: []
            // },
            {
                title: 'Limit',
                component: (
                    <div key='4' className={style.content}>
                        <Accordion onToggle={empty} title={sections.limit.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                            <div style={{padding: '20px'}}>
                                <SectionLimit
                                  data={this.state.data.limit}
                                  addRow={this.addLimitRow}
                                  deleteRow={this.deleteLimitRow}
                                />
                            </div>
                        </Accordion>
                    </div>
                ),
                validations: []
            },
            // {
            //     title: 'Limit (Daily per entry)',
            //     component: (
            //         <div key='4' className={style.content}>
            //             <Accordion onToggle={empty} title={sections.limitPerEntry.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
            //                 <div style={{padding: '20px'}}>
            //                     <SectionLimitPerEntry
            //                       data={this.state.data.limitPerEntry}
            //                       addRow={this.addLimitPerEntryRow}
            //                       deleteRow={this.deleteLimitPerEntryRow}
            //                     />
            //                 </div>
            //             </Accordion>
            //         </div>
            //     ),
            //     validations: []
            // },
            {
                title: 'Split',
                component: (
                    <div className={style.content}>
                        <Accordion key='5' onToggle={empty} title={sections.split.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body} >
                            <Split
                              data={this.state.data.split}
                              nomenclatures={this.props.nomenclatures}
                              addSplitRow={this.addSplitRow}
                              deleteSplitRow={this.deleteSplitRow}
                              addSplitRangeRow={this.addSplitRangeRow}
                              deleteSplitRangeRow={this.deleteSplitRangeRow}
                              addSplitAssignmentRow={this.addSplitAssignmentRow}
                              deleteSplitAssignmentRow={this.deleteSplitAssignmentRow}
                              config={sections.split}
                            />
                        </Accordion>
                    </div>
                ),
                validations: []
            },
            {
                title: 'Summary',
                component: (
                    <div key='6' className={style.content}>
                        <Accordion onToggle={empty} title={sections.summary.title} fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body} >
                            <SectionSummary
                              data={this.state.data}
                              nomenclatures={this.props.nomenclatures}
                            />
                        </Accordion>
                    </div>
                ),
                validations: []
            }
        ];

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
                    <div className={style.wrapper} style={{height: '650px'}}>
                        <TabContainer
                          tabs={tabs}
                        />
                    </div>
                </div>
            </Dialog>
        );
    }
});
