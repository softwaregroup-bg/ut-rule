import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import Grid from '../../components/Grid';
import Dialog from '../../components/Dialog';
import Prompt from '../../components/Prompt';
import mainStyle from 'ut-front-react/assets/index.css';
import { AddTab } from 'ut-front-react/containers/TabMenu';
import Header from 'ut-front-react/components/PageLayout/Header';
import GridToolbox from 'ut-front-react/components/SimpleGridToolbox';
import AdvancedPagination from 'ut-front-react/components/AdvancedPagination';
import MultiSelectDropdown from 'ut-front-react/components/Input/MultiSelectDropdown';
import Input from 'ut-front-react/components/Input';
import ToolboxFilter from './ToolboxFilter';
import ToolboxButtons from './ToolboxButtons';
import ToolboxClearFilter from './ClearFilter';
import classnames from 'classnames';
import style from './style.css';
import * as actionCreators from './actionCreators';
import Button from 'ut-front-react/components/StandardButton';

const Main = React.createClass({
    propTypes: {
        rules: PropTypes.object,
        conditionActor: PropTypes.array,
        conditionItem: PropTypes.array,
        conditionProperty: PropTypes.array,
        nomenclatures: PropTypes.object,
        formatedGridData: PropTypes.object,
        ready: PropTypes.bool,
        actions: PropTypes.object,
        location: PropTypes.object,
        uiConfig: PropTypes.object,
        columns: PropTypes.object,
        sections: PropTypes.object,
        pagination: PropTypes.object
    },
    getInitialState() {
        return {
            selectedConditions: {},
            canEdit: false,
            canDelete: false,
            prompt: false,
            dialog: {
                open: false,
                conditionId: null
            },
            showFilter: false,
            showButtons: true,
            filterData: {
                operationIds: [],
                priority: {
                    from: {
                        value: null,
                        isValid: true
                    },
                    to: {
                        value: null,
                        isValid: true
                    }
                },
                errorMessage: 'Enter numerical values'
            },
            uiConfig: this.props.uiConfig.toJS()
        };
    },
    fetchData(props) {
        let { pageSize, pageNumber } = props.pagination;

        this.props.actions.fetchNomenclatures(this.state.uiConfig.nomenclatures)
            .then(() => this.props.actions.fetchRules({ pageSize, pageNumber }));
    },
    componentWillMount() {
        this.fetchData(this.props);
    },
    componentWillReceiveProps(nextProps) {
        if (this.props.pagination.changeId !== nextProps.pagination.changeId) {
            this.fetchData(nextProps);
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.ready;
    },
    handleCheckboxSelect(isSelected, data) {
        let selectedConditions = this.state.selectedConditions;
        if (isSelected === null) {
            isSelected = selectedConditions[data.id];
        }
        if (isSelected) {
            delete selectedConditions[data.id];
        } else {
            selectedConditions[data.id] = true;
        }
        let count = Object.keys(selectedConditions).length;
        this.setState({
            selectedConditions: selectedConditions,
            canEdit: count === 1,
            canView: count === 1,
            canDelete: count > 0,
            showFilter: count === 0,
            showButtons: count > 0
        });
        return !isSelected;
    },
    handleHeaderCheckboxSelect(isSelected) {
        this.setState({
            selectedConditions: isSelected ? {} : Object.keys(this.props.rules).reduce((all, key) => { all[key] = true; return all; }, {}),
            canEdit: false,
            canView: false,
            canDelete: !isSelected
        });
    },
    createBtnOnClick() {
        this.setState({
            dialog: {
                open: true,
                conditionId: null
            }
        });
    },
    editBtnOnClick() {
        this.setState({
            dialog: {
                open: true,
                hasEditPermission: this.context.checkPermission('rule.rule.edit'),
                conditionId: Object.keys(this.state.selectedConditions)[0]
            }
        });
    },
    viewBtnOnClick() {
        this.setState({
            dialog: {
                open: true,
                hasEditPermission: false,
                conditionId: Object.keys(this.state.selectedConditions)[0]
            }
        });
    },
    dialogOnClose() {
        this.setState({
            dialog: {
                open: false,
                conditionId: null
            }
        });
    },
    dialogOnSave(data) {
        let action = this.state.dialog.conditionId ? 'editRule' : 'addRule';
        this.setState(this.getInitialState(), () => this.props.actions[action](data));
    },
    removeRules() {
        let conditionsArray = Object.keys(this.state.selectedConditions).map((key) => (parseInt(key, 10)));
        this.setState(this.getInitialState(), () => this.props.actions.removeRules({
            conditionId: conditionsArray
        }));
    },
    refresh() {
        this.setState(this.getInitialState(), () => this.props.actions.reset());
    },
    showPrompt() {
        this.setState({
            prompt: true
        });
    },
    hidePrompt() {
        this.setState({
            prompt: false
        });
    },
    fetchRulesWithFilter() {
        let { pageSize, pageNumber } = this.props.pagination;
        let { from, to } = this.state.filterData.priority;
        let operationType = this.state.filterData.operationIds.map(operation => {
            return Number(operation.key);
        });
        this.props.actions.fetchRules({ operationType, pageSize, pageNumber, minPriority: from.value, maxPriority: to.value });
    },
    onSelectDropdown(field) {
        let data = this.state.filterData;
        data[field.key] = field.value;
        this.setState({
            filterData: data
        }, () => {
            this.fetchRulesWithFilter();
        });
    },
    onInputChange({ key, value, initValue, error, errorMessage }) {
        let data = this.state.filterData;
        if (isNaN(value) && value !== '') {
            data.priority[key].isValid = false;
            data.priority[key].value = null;
            this.setState({
                filterData: data
            });
        } else {
            data.priority[key].value = value === '' ? null : value;
            data.priority[key].isValid = true;
            this.setState({
                filterData: data
            }, () => {
                this.fetchRulesWithFilter();
            });
        }
    },
    toggleGridToolBox(val) {
        this.setState({
            showFilter: !this.state.showFilter,
            showButtons: !this.state.showButtons
        });
    },
    clearFilter() {
        let filterData = {
            operationIds: [],
            priority: {
                from: {
                    value: null,
                    isValid: true
                },
                to: {
                    value: null,
                    isValid: true
                }
            },
            errorMessage: 'Enter numerical values'
        };
        this.setState({
            filterData
        });
        let { pageSize, pageNumber } = this.props.pagination;
        this.props.actions.fetchRules({ pageSize, pageNumber });
    },
    render() {
        if (!this.props.ready) {
            return null;
        }
        let { showFilter, showButtons, filterData, selectedConditions } = this.state;
        let { errorMessage, priority, operationIds } = this.state.filterData;
        let uiConfig = this.state.uiConfig;
        let columns = uiConfig.main.grid.columns;
        let sections = uiConfig.dialog.sections;
        const buttons = [];
        if (this.context.checkPermission('rule.rule.add')) {
            buttons.push({ text: 'Create Rule', onClick: this.createBtnOnClick, styleType: 'primaryLight' });
        }

        return <div className={mainStyle.contentTableWrap}>
            <AddTab pathname={this.props.location.pathname} title='Rule Management' />
            {this.state.dialog.open
                ? <Dialog
                    ref='dialog'
                    open={this.state.dialog.open}
                    hasEditPermission={this.state.dialog.hasEditPermission}
                    isEdit={!!this.state.dialog.conditionId}
                    data={this.props.rules[this.state.dialog.conditionId]}
                    conditionProperty={this.props.conditionProperty}
                    conditionActor={this.props.conditionActor}
                    conditionItem={this.props.conditionItem}
                    nomenclatures={this.props.nomenclatures}
                    onSave={this.dialogOnSave}
                    onClose={this.dialogOnClose}
                    sections={sections}
                />
                : <div>
                    <div className={style.header}>
                        <Header text='Rule Management' buttons={buttons} />
                    </div>
                    <div className={classnames(mainStyle.actionBarWrap, style.actionBarWrap)}>
                        <ToolboxFilter selected={selectedConditions} toggle={this.toggleGridToolBox} show={showFilter}>
                            <div className={style.filterWrap} >
                                <div className={style.filterSeparated}>
                                    <Input
                                        keyProp='from'
                                        errorMessage={errorMessage}
                                        isValid={priority.from.isValid}
                                        type='input'
                                        value={priority.from.value}
                                        placeholder='Priority from'
                                        onChange={this.onInputChange}
                                    />
                                </div>
                                <div className={style.filterSeparated}>
                                    <Input
                                        keyProp='to'
                                        errorMessage={errorMessage}
                                        isValid={priority.to.isValid}
                                        type='input'
                                        value={priority.to.value}
                                        placeholder='Priority to'
                                        onChange={this.onInputChange}
                                    />
                                </div>
                                <div className={style.multiFilterSeparated}>
                                <MultiSelectDropdown
                                    defaultSelected={operationIds}
                                    label='Operations'
                                    data={Object.keys(this.props.nomenclatures.operation).map(key => {
                                        return {
                                            key,
                                            name: this.props.nomenclatures.operation[key]
                                        };
                                    }) || []}
                                    keyProp='operationIds'
                                    placeholder="Select"
                                    onSelect={this.onSelectDropdown}
                                    type="dropdownMultiSelect"
                                />
                                </div>
                                <div className={style.clearFilterSeparated}>
                                    <ToolboxClearFilter filterData={filterData} clearFilter={this.clearFilter} />
                                </div>
                            </div>
                        </ToolboxFilter>
                        <ToolboxButtons selected={selectedConditions} toggle={this.toggleGridToolBox} show={showButtons}>
                            <div className={style.gridToolBoxButtons}>
                                {this.context.checkPermission('rule.rule.edit') &&
                                    <Button
                                        onClick={this.editBtnOnClick}
                                        disabled={!this.state.canEdit}
                                        styleType='secondaryDark'
                                        label='Edit'
                                    />
                                }
                                {this.context.checkPermission('rule.rule.view') && <button onClick={this.viewBtnOnClick} className={classnames('button btn btn-primary', style.deleteButton)}  disabled={!this.state.canView}>
                                    View
                                </button>
                                }
                                {this.context.checkPermission('rule.rule.remove') && <button onClick={this.showPrompt} className={classnames('button btn btn-primary', style.deleteButton)} disabled={!this.state.canEdit}>
                                    Delete
                                </button>
                                }
                            </div>
                        </ToolboxButtons>
                    </div>
                    <div className={classnames(mainStyle.tableWrap, style.tableWrap)}>
                        <div className={style.grid} >
                            {this.state.prompt &&
                                <Prompt
                                    ref='prompt'
                                    open={this.state.prompt}
                                    message={
                                       'Are you sure you want to delete the selected rule?'
                                    }
                                    title='Delete Rule'
                                    onOk={this.removeRules}
                                    onCancel={this.hidePrompt}
                                />
                            }
                            <Grid
                                ref='grid'
                                refresh={this.refresh}
                                data={this.props.rules}
                                selectedConditions={this.state.selectedConditions}
                                nomenclatures={this.props.nomenclatures}
                                formatedGridData={this.props.formatedGridData}
                                handleCheckboxSelect={this.handleCheckboxSelect}
                                handleHeaderCheckboxSelect={this.handleHeaderCheckboxSelect}
                                columns={columns}
                            />
                        </div>
                    </div>
                    <div className={style.paginationWrap}>
                        <AdvancedPagination
                            onUpdate={this.props.actions.updatePagination}
                            pagination={fromJS(this.props.pagination)} />
                    </div>
                </div>}
            {false &&
                <div>
                    <div className={style.rulesNomenclatures}>
                        RULES <br /><hr /><br /><pre>{JSON.stringify(this.props.rules, null, 2)}</pre>
                    </div>
                    <div className={style.rulesNomenclatures}>
                        NOMENCLATURES <br /><hr /><br /><pre>{JSON.stringify(this.props.nomenclatures, null, 2)}</pre>
                    </div>
                </div>
            }
        </div>;
    }
});

Main.contextTypes = {
    checkPermission: PropTypes.func
};

export default connect(
    (state, ownProps) => {
        return {
            rules: state.main.fetchRules,
            conditionActor: state.main.conditionActor,
            conditionItem: state.main.conditionItem,
            conditionProperty: state.main.conditionProperty,
            nomenclatures: state.main.fetchNomenclatures,
            formatedGridData: state.main.formatedGridData,
            ready: !!(state.main.fetchRules && state.main.fetchNomenclatures),
            roles: state.main.fetchRoles,
            organizations: state.main.fetchOrganizations,
            uiConfig: state.uiConfig,
            pagination: state.main.pagination || {
                pageSize: 25,
                pageNumber: 1,
                recordsTotal: 0
            }
        };
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(actionCreators, dispatch)
        };
    }
)(Main);
