import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS } from 'immutable';
import { AddTab } from 'ut-front-react/containers/TabMenu';
import { getLink } from 'ut-front-react/routerHelper';
import { removeTab, updateTabTitle } from 'ut-front-react/containers/TabMenu/actions';

import Page from 'ut-front-react/components/PageLayout/Page';
import Container from 'ut-front-react/components/PageLayout/Container';
import Content from 'ut-front-react/components/PageLayout/Content';
import TabContainer from 'ut-front-react/containers/TabContainer';
import StatusDialog from 'ut-front-react/components/StatusDialog';
import Channel from '../Tabs/Channel';
import Source from '../Tabs/Source';
import Operation from '../Tabs/Operation';
import Destination from '../Tabs/Destination';
import Split from '../Tabs/Split';
import Limit from '../Tabs/Limit';
import * as actions from '../actions';
import { HistoryLog } from 'ut-history/ui';
import { prepareRuleToSave, prepareRuleErrors, isEmptyValuesOnly, getRuleErrorCount, tabTitleMap, prepareRuleModel, diff } from '../helpers';
const status = fromJS({
    status: 'SUCCESS',
    message: 'Rule successfully saved'
});
const mode = 'edit';
const baseTabTitle = 'Edit Rule';
class RuleEdit extends Component {
    constructor(props, context) {
        super(props, context);
        this.onSave = this.onSave.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.onReset = this.onReset.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.state = {
            closeAfterSave: false,
            showErrorStatus: false,
            refetchHistory: false
        };
    }

    fetchData() {
        const { fetchNomenclatures, changeRuleProfile, getRule } = this.props.actions;
        const { nomenclatureConfiguration, config, match, remoteRule } = this.props;
        const { nomenclaturesFetched } = config || {};
        changeRuleProfile(mode, match.params.id);
        !remoteRule && getRule(match.params.id);
        !nomenclaturesFetched && fetchNomenclatures(nomenclatureConfiguration);
    }

    componentWillMount() {
        this.fetchData();
    }

    getTitle(remoteRule) {
        return remoteRule ? baseTabTitle.concat(' - ', ((remoteRule.condition || [])[0] || {}).priority) : baseTabTitle;
    }

    componentWillReceiveProps(nextProps) {
        const { id } = nextProps.match.params;
        const { remoteRule, updateTabTitle } = nextProps;
        const { changeRuleProfile, getRule } = this.props.actions;
        if (id && id !== this.props.match.params.id) {
            changeRuleProfile(mode, id);
        } else if (this.props.config.id && !remoteRule && remoteRule !== this.props.remoteRule) {
            getRule(nextProps.match.params.id);
        }
        if (this.getTitle(remoteRule) !== this.getTitle(this.props.remoteRule)) {
            const pathname = getLink('ut-rule:edit', { id });
            updateTabTitle(pathname, this.getTitle(remoteRule));
        }
    }

    handleDialogClose() {
        this.onReset(this.state.closeAfterSave);
    }

    onSave() {
        const formattedRule = prepareRuleToSave(this.props.rule);
        this.props.actions.editRule(formattedRule);
    }

    onReset(closeAfterSave) {
        this.props.actions.resetRuleState();
        this.setState({refetchHistory: true});
        closeAfterSave && this.props.removeTab(this.props.activeTab.pathname);
    }

    getTabs() {
        const { tabsConfiguration: {channel, source, operation, destination, split, limit} } = this.props;

        const errorCount = getRuleErrorCount(this.props.errors.toJS());
        const canEdit = this.context.checkPermission('rule.rule.edit') && !isEmptyValuesOnly(this.props.remoteRule);

        const tabs = [
            channel.visible && {
                title: channel.title || 'Channel',
                component: <Channel canEdit={canEdit} />,
                errorsCount: errorCount.channel
            },
            source.visible && {
                title: source.title || 'Source',
                component: <Source canEdit={canEdit} />,
                errorsCount: errorCount.source
            },
            operation.visible && {
                title: operation.title || 'Operation',
                component: <Operation canEdit={canEdit} />,
                errorsCount: errorCount.operation
            },
            destination.visible && {
                title: destination.title || 'Destination',
                component: <Destination canEdit={canEdit} />,
                errorsCount: errorCount.destination
            },
            split.visible && {
                title: split.title || 'Fee and Commission Split',
                component: <Split canEdit={canEdit} />,
                errorsCount: errorCount.split
            },
            limit.visible && {
                title: limit.title || 'Limit',
                component: <Limit canEdit={canEdit} />,
                errorsCount: errorCount.limit
            }
        ].filter(v => v);

        if (this.context.checkPermission('history.rule.listChanges') && this.props.remoteRule) {
            const forcelyUpdateHistory = this.state.refetchHistory && this.props.rule.activeTab === tabs.length;
            tabs.push({
                title: 'History Log',
                component: <HistoryLog forceUpdate={forcelyUpdateHistory} objectId={this.props.match.params.id} objectName='rule' objectDisplayName={String(((this.props.remoteRule.condition || [])[0] || {}).priority || '')} />
            });
            forcelyUpdateHistory && this.setState({refetchHistory: false});
        }
        return tabs;
    }

    getActionButtons() {
        const { errors, rule, remoteRule } = this.props;
        let isEdited = true;
        // logic to check whether the rule has changed
        const { channel, destination, operation, source, limit, split } = rule;
        const editedRule = { channel, destination, operation, source, limit, split };
        if (!isEmptyValuesOnly(editedRule)) {
            const remoteRuleData = prepareRuleModel(remoteRule) || {};
            const remoteRuleModel = {
                channel: remoteRuleData.channel,
                destination: remoteRuleData.destination,
                operation: remoteRuleData.operation,
                source: remoteRuleData.source,
                limit: remoteRuleData.limit,
                split: remoteRuleData.split
            };
            isEdited = !isEmptyValuesOnly(diff(editedRule, remoteRuleModel)) || !isEmptyValuesOnly(diff(remoteRuleModel, editedRule));
        }
        isEdited && (isEdited = !isEmptyValuesOnly(remoteRule));
        const newErrors = prepareRuleErrors(rule, errors.toJS());
        const isValid = isEmptyValuesOnly(newErrors);
        const showError = () => {
            !isEmptyValuesOnly(newErrors) && this.props.actions.updateRuleErrors(newErrors);
            this.setState({showErrorStatus: true});
        };
        const create = () => {
            if (!isValid) return showError();
            this.state.closeAfterSave && this.setState({
                closeAfterSave: false
            });
            this.onSave();
        };
        const createAndClose = () => {
            if (!isValid) return showError();
            this.setState({
                closeAfterSave: true
            });
            this.onSave();
        };
        const actionButtons = [{
            text: 'Close',
            onClick: () => {
                return this.onReset(true);
            }
        }];
        isEdited && this.context.checkPermission('rule.rule.edit') && actionButtons.unshift({
            text: 'Save',
            performFullValidation: true,
            onClick: create
        }) && actionButtons.unshift({
            text: 'Save and Close',
            performFullValidation: true,
            onClick: createAndClose,
            styleType: 'primaryLight'
        });
        return actionButtons;
    }

    renderErrorStatusDialog() {
        const errorCount = getRuleErrorCount(this.props.errors.toJS());
        let totalErrors = 0;
        let totalErrorTabs = 0;
        let tabErrorMsg = '';
        const close = () => {
            this.setState({showErrorStatus: false});
        };
        for (const key in errorCount) {
            if (errorCount[key]) {
                totalErrorTabs++;
                totalErrors += errorCount[key];
                const currentErrorString = errorCount[key] > 1 ? 'errors' : 'error';
                tabErrorMsg += `<li>${tabTitleMap[key]}: ${errorCount[key]} ${currentErrorString}</li>`;
            }
        }
        const errorString = totalErrors > 1 ? 'errors' : 'error';
        const tabString = totalErrorTabs > 1 ? 'tabs' : 'tab';
        const statusErrorMessage = `Your request can not be saved because you have ${errorString} in the following ${tabString}:<ul>${tabErrorMsg}</ul>`;
        return <StatusDialog onClose={close} status={fromJS({status: 'failed', message: statusErrorMessage})} />;
    }

    renderTabContainer() {
        return (
            <TabContainer
                headerTitle={this.getTitle(this.props.remoteRule)}
                onTabClick={this.props.actions.changeActiveTab}
                active={this.props.rule.activeTab || 0}
                tabs={this.getTabs()}
                actionButtons={this.getActionButtons()}
            />
        );
    }

    render() {
        const { ruleSaved } = this.props.config;
        const { id } = this.props.match.params;
        return (
            <Page>
                <AddTab pathname={getLink('ut-rule:edit', { id })} title={this.getTitle(this.props.remoteRule)} />
                {ruleSaved && <StatusDialog status={status} onClose={this.handleDialogClose} />}
                {this.state.showErrorStatus && this.renderErrorStatusDialog()}
                <Container>
                    <Content style={{position: 'relative'}}>
                        {this.renderTabContainer()}
                    </Content>
                </Container>
            </Page>
        );
    }
}

RuleEdit.propTypes = {
    rule: PropTypes.object,
    match: PropTypes.object.isRequired,
    actions: PropTypes.object,
    activeTab: PropTypes.object,
    updateTabTitle: PropTypes.func.isRequired,
    removeTab: PropTypes.func.isRequired,
    config: PropTypes.object,
    remoteRule: PropTypes.object,
    nomenclatureConfiguration: PropTypes.shape({}).isRequired,
    tabsConfiguration: PropTypes.object.isRequired,
    errors: PropTypes.object // immutable
};

RuleEdit.defaultProps = {};

const mapStateToProps = (state, ownProps) => {
    const tabState = state.ruleProfileReducer.getIn([mode, ownProps.match.params.id]);
    // console.log('tabState ? tabState.toJS(): ',tabState && tabState.toJS());
    // debugger;
    return {
        activeTab: state.tabMenu.active,
        config: state.ruleProfileReducer.get('config').toJS(),
        nomenclatureConfiguration: state.uiConfig.get('nomenclatures').toJS(),
        tabsConfiguration: state.uiConfig.getIn(['profile', 'tabs']).toJS(),
        rule: tabState ? tabState.toJS() : {},
        hasChanged: tabState ? tabState.get('hasChanged') : false,
        remoteRule: state.ruleProfileReducer.getIn(['rules', ownProps.match.params.id]),
        errors: tabState ? tabState.get('errors') : fromJS({})
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    removeTab: bindActionCreators(removeTab, dispatch),
    updateTabTitle: bindActionCreators(updateTabTitle, dispatch)
});
RuleEdit.contextTypes = {
    checkPermission: PropTypes.func
};
export default connect(mapStateToProps, mapDispatchToProps)(RuleEdit);
