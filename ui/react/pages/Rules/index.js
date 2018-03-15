import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import Grid from '../../components/Grid';
import ConfirmDialog from 'ut-front-react/components/ConfirmDialog';
import { getLink } from 'ut-front/react/routerHelper';
import mainStyle from 'ut-front-react/assets/index.css';
import { AddTab } from 'ut-front-react/containers/TabMenu';
import Header from 'ut-front-react/components/PageLayout/Header';
import GridToolBox from 'ut-front-react/components/SimpleGridToolbox';
import AdvancedPagination from 'ut-front-react/components/AdvancedPagination';
import Button from 'ut-front-react/components/StandardButton';
import classnames from 'classnames';
import style from './style.css';
import * as actionCreators from './actionCreators';

const Main = React.createClass({
    propTypes: {
        rules: PropTypes.object,
        nomenclatures: PropTypes.object,
        formatedGridData: PropTypes.object,
        ready: PropTypes.bool,
        actions: PropTypes.object,
        uiConfig: PropTypes.object,
        pagination: PropTypes.object
    },
    getInitialState() {
        return {
            selectedConditions: {},
            canEdit: false,
            canDelete: false,
            uiConfig: this.props.uiConfig.toJS()
        };
    },
    fetchData(props) {
        let {pageSize, pageNumber} = props.pagination;

        this.props.actions.fetchRules({pageSize, pageNumber});
        this.props.actions.fetchNomenclatures(this.state.uiConfig.nomenclatures);
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
    removeRules() {
        let conditionsArray = Object.keys(this.state.selectedConditions).map((key) => (parseInt(key, 10)));
        this.setState(this.getInitialState(), () => this.props.actions.removeRules({
            conditionId: conditionsArray
        }));
    },
    refresh() {
        this.setState(this.getInitialState(), () => this.props.actions.reset());
    },
    showConfirm() {
        this.refs['showRuleConfirmDialog'] && this.refs['showRuleConfirmDialog'].open();
    },
    getHeaderButtons() {
        let buttons = [];
        this.context.checkPermission('rule.rule.add') &&
            buttons.push({text: 'Create Rule', href: getLink('ut-rule:create'), styleType: 'primaryLight'});
        return buttons;
    },
    render() {
        if (!this.props.ready) {
            return null;
        }

        let uiConfig = this.state.uiConfig;
        let columns = uiConfig.main.grid.columns;
        let id = Object.keys(this.state.selectedConditions)[0];
        return <div>
            <AddTab pathname={getLink('ut-rule:rules')} title='Fees, Commissions and Limits (FCL)' />
            <Header text='Fees, Commissions and Limits (FCL)' buttons={this.getHeaderButtons()} />
            <div className={classnames(mainStyle.contentTableWrap, style.contentTableWrap)}>
                <div className={classnames(mainStyle.actionBarWrap, style.actionBarWrap)}>
                    <GridToolBox opened title='' >
                      <div className={style.actionWrap} >
                        { this.context.checkPermission('rule.rule.edit') &&
                            (<Button label='Edit' href={getLink('ut-rule:edit', { id })} disabled={!this.state.canEdit} className='defaultBtn' />)}
                        { this.context.checkPermission('rule.rule.remove') &&
                            (<Button label='Delete' disabled={!this.state.canDelete} className='defaultBtn' onClick={this.showConfirm} />)}
                      </div>
                    </GridToolBox>
                </div>
                <div className={classnames(mainStyle.tableWrap, style.tableWrap)}>
                    <div className={style.grid} >
                      <ConfirmDialog
                        ref={'showRuleConfirmDialog'}
                        submitLabel='Yes'
                        title='Warning'
                        message={
                            'You are about to delete ' +
                            (
                                Object.keys(this.state.selectedConditions).length === 1
                                    ? '1 rule'
                                    : Object.keys(this.state.selectedConditions).length + ' rules'
                            ) +
                            '. Would you like to proceed?'}
                        onSubmit={this.removeRules} />
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
        </div>;
    }
});

Main.contextTypes = {
    checkPermission: PropTypes.func.isRequired
};

export default connect(
    (state, ownProps) => {
        return {
            rules: state.ruleList.fetchRules,
            nomenclatures: state.ruleList.fetchNomenclatures,
            formatedGridData: state.ruleList.formatedGridData,
            ready: !!(state.ruleList.fetchRules && state.ruleList.fetchNomenclatures),
            roles: state.ruleList.fetchRoles,
            organizations: state.ruleList.fetchOrganizations,
            uiConfig: state.uiConfig,
            pagination: state.ruleList.pagination || {
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
