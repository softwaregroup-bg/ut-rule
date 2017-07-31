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
import resizibleTypes from 'ut-front-react/components/ResiziblePageLayout/resizibleTypes';
import ResizibleContainer from 'ut-front-react/components/ResiziblePageLayout/Container';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import BusinessUnitsTree from 'ut-core/ui/react/containers/BusinessUnits';
import GridToolbox from 'ut-front-react/components/SimpleGridToolbox';
import AdvancedPagination from 'ut-front-react/components/AdvancedPagination';
import classnames from 'classnames';
import style from './style.css';
import * as actionCreators from './actionCreators';

const defaultAsideWidth = 200;
const defaultAsideMinWidth = 100;
const defaultCollapsedWidth = 30;

const Main = React.createClass({
    propTypes: {
        rules: PropTypes.object,
        conditionActor: PropTypes.array,
        conditionItem: PropTypes.array,
        conditionProperty: PropTypes.array,
        nomenclatures: PropTypes.object,
        currencyOrganization: PropTypes.array,
        formatedGridData: PropTypes.object,
        ready: PropTypes.bool,
        actions: PropTypes.object,
        location: PropTypes.object,
        uiConfig: PropTypes.object,
        columns: PropTypes.object,
        sections: PropTypes.object,
        pagination: PropTypes.object,
        filters: PropTypes.any
    },
    contextTypes: {
        checkPermission: PropTypes.func
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
            uiConfig: this.props.uiConfig.toJS()
        };
    },
    fetchData(props, additionalProps = {}, options) {
        props = props === null ? this.props : props;
        let { businessUnitId, transactionTypeId, agentTypeId } = props.filters;
        let { pageSize, pageNumber } = props.pagination;
        let fetchParams = Object.assign({}, {
            actorProperties: [
                Object.assign({}, {businessUnitId}, additionalProps).businessUnitId,
                Object.assign({}, {agentTypeId}, additionalProps).agentTypeId
            ].filter(Boolean).map(v => { return { value: v }; }),
            itemProperties: [
                Object.assign({}, {transactionTypeId}, additionalProps).transactionTypeId
            ].filter(Boolean).map(v => { return { value: v }; }),
            pageNumber,
            pageSize
        }, additionalProps);

        delete fetchParams.businessUnitId;
        delete fetchParams.transactionTypeId;
        delete fetchParams.agentTypeId;

        this.props.actions.fetchRules(fetchParams);
        if (options && typeof options.fetchNomenclatures !== 'undefined' && options.fetchNomenclatures === false) {} else {
            this.props.actions.fetchNomenclatures(this.state.uiConfig.nomenclatures);
        }
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
            canDelete: count > 0
        });
        return !isSelected;
    },
    handleHeaderCheckboxSelect(isSelected) {
        this.setState({
            selectedConditions: isSelected ? {} : Object.keys(this.props.rules).reduce((all, key) => { all[key] = true; return all; }, {}),
            canEdit: false,
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
        this.setState(this.getInitialState(), () => this.props.actions[action](data).then(res => {
            this.fetchData(this.props);
            return res;
        }));
    },
    removeRules() {
        let conditionsArray = Object.keys(this.state.selectedConditions).map((key) => (parseInt(key, 10)));
        this.setState(this.getInitialState(), () => this.props.actions.removeRules({
            conditionId: conditionsArray
        }).then(res => {
            this.fetchData(this.props);
            return res;
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
    onBusinessUnitChange(businessUnit, breadcrumbs) {
        let businessUnitId = businessUnit ? businessUnit.id : null;
        this.props.actions.saveVariable('businessUnitId', businessUnitId);
        this.fetchData(this.props, { businessUnitId }, {
            fetchNomenclatures: false
        });
    },
    handleFilterChange(e) {
        let value = e.value === '__placeholder__' ? null : e.value;
        this.props.actions.saveVariable(e.key, value);
        this.fetchData(this.props, { [e.key]: value }, {
            fetchNomenclatures: false
        });
    },
    render() {
        if (!this.props.ready) {
            return null;
        }

        let uiConfig = this.state.uiConfig;
        let columns = uiConfig.main.grid.columns;
        let sections = uiConfig.dialog.sections;
        let contentNormalWidth = window.window.innerWidth - (defaultAsideWidth + defaultAsideWidth);
        let asideStyles = { minWidth: defaultAsideWidth };
        let operations = Object.keys((this.props.nomenclatures && this.props.nomenclatures.operation) || {}).map(key => {
            return {key, name: this.props.nomenclatures.operation[key]};
        }) || [];
        let agentTypes = Object.keys((this.props.nomenclatures && this.props.nomenclatures.role) || {}).map(key => {
            return {key, name: this.props.nomenclatures.role[key]};
        }) || [];

        let leftAside = (
            <div style={{ minWidth: defaultAsideWidth }}>
                <BusinessUnitsTree identifier='businessUnitsList' showUnselectAll
                  onActiveClick={this.onBusinessUnitChange}
                  active
                />
            </div>
        );

        let content = (
            <div>
                <div className={classnames(mainStyle.tableWrap, style.tableWrap)}>
                <div className={style.grid} >
                    {this.state.dialog.open &&
                        <Dialog
                          ref='dialog'
                          open={this.state.dialog.open}
                          data={this.props.rules[this.state.dialog.conditionId]}
                          conditionProperty={this.props.conditionProperty}
                          conditionActor={this.props.conditionActor}
                          conditionItem={this.props.conditionItem}
                          nomenclatures={this.props.nomenclatures}
                          currencyOrganization={this.props.currencyOrganization}
                          onSave={this.dialogOnSave}
                          onClose={this.dialogOnClose}
                          sections={sections}
                        />
                    }
                    {this.state.prompt &&
                        <Prompt
                          ref='prompt'
                          open={this.state.prompt}
                          message={
                                'You are about to delete ' +
                                (
                                    Object.keys(this.state.selectedConditions).length === 1
                                        ? '1 rule'
                                        : Object.keys(this.state.selectedConditions).length + ' rules'
                                ) +
                                '. Would you like to proceed?'
                            }
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
                      fetchData={this.fetchData}
                      saveVariable={this.props.actions.saveVariable}
                    />
                </div>
            </div>
            <div className={style.paginationWrap}>
                <AdvancedPagination
                  onUpdate={this.props.actions.updatePagination}
                  pagination={fromJS(this.props.pagination)} />
            </div>
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
            </div>
        );

        let containerCols = [
            {
                type: resizibleTypes.ASIDE,
                id: 'ruleLeftBUTree',
                width: defaultAsideWidth,
                normalWidth: defaultAsideWidth,
                minWidth: defaultAsideMinWidth,
                innerColStyles: {overflowX: 'hidden'},
                collapsedWidth: defaultCollapsedWidth,
                child: leftAside,
                heading: ('Business Units'),
                info: ('Select business unit to filter bio reader list'),
                styles: asideStyles
            },
            {
                type: resizibleTypes.CONTENT,
                id: 'ruleMainGridContent',
                width: contentNormalWidth,
                normalWidth: contentNormalWidth,
                minWidth: 250,
                child: content
            }
        ];

        return <div className={mainStyle.contentTableWrap}>
            <AddTab pathname={this.props.location.pathname} title='Rule Management' />
            <div className={style.header}>
                <Header text='Rule Management' buttons={[{ text: 'Create Rule', onClick: this.createBtnOnClick, styleType: 'primaryLight' }]} />
            </div>
            <div className={classnames(mainStyle.actionBarWrap, style.actionBarWrap)}>
                <GridToolbox opened title='' >
                    <div className={style.gridToolBoxButtons}>
                        { this.context.checkPermission('db/rule.rule.edit') && <button onClick={this.editBtnOnClick} className='button btn btn-primary' disabled={!this.state.canEdit}>
                            Edit
                        </button> }
                        { this.context.checkPermission('db/rule.rule.remove') && <button onClick={this.showPrompt} className={classnames('button btn btn-primary', style.deleteButton)} disabled={!this.state.canEdit}>
                            Delete
                        </button>
                        }
                    </div>
                    <div className={style.toolBoxFilters}>
                        <div className={style.filterWrapper}>
                          <Dropdown
                            data={agentTypes}
                            customTheme
                            placeholder='Agent type...'
                            keyProp='agentTypeId'
                            defaultSelected={this.props.filters.agentTypeId || ''}
                            canSelectPlaceholder
                            onSelect={this.handleFilterChange}
                           />
                        </div>
                        <div className={style.filterWrapper}>
                          <Dropdown
                            data={operations}
                            customTheme
                            placeholder='Transaction type...'
                            keyProp='transactionTypeId'
                            defaultSelected={this.props.filters.transactionTypeId || ''}
                            canSelectPlaceholder
                            onSelect={this.handleFilterChange}
                           />
                        </div>
                    </div>
                </GridToolbox>
            </div>
             <ResizibleContainer cols={containerCols} />
        </div>;
    }
});

export default connect(
    (state, ownProps) => {
        let implementationParseHelper = ownProps.route.implementationParseHelper ? ownProps.route.implementationParseHelper : (a) => { return a; };
        let props = {
            rules: state.main.fetchRules,
            conditionActor: state.main.conditionActor,
            conditionItem: state.main.conditionItem,
            conditionProperty: state.main.conditionProperty,
            nomenclatures: state.main.fetchNomenclatures,
            currencyOrganization: state.main.currencyOrganization,
            formatedGridData: state.main.formatedGridData,
            ready: !!(state.main.fetchRules && state.main.fetchNomenclatures),
            roles: state.main.fetchRoles,
            organizations: state.main.fetchOrganizations,
            uiConfig: state.uiConfig,
            pagination: state.main.pagination || {
                pageSize: 25,
                pageNumber: 1,
                recordsTotal: 0
            },
            filters: {
                businessUnitId: state.main.businessUnitId,
                transactionTypeId: state.main.transactionTypeId,
                agentTypeId: state.main.agentTypeId,
                sortBy: state.main.sortBy,
                sortOrder: state.main.sortOrder
            }
        };
        return Object.assign(props, implementationParseHelper(props));
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(actionCreators, dispatch)
        };
    }
)(Main);
