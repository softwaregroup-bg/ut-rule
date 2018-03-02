import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS } from 'immutable';
import { AddTab } from 'ut-front-react/containers/TabMenu';
import { getLink } from 'ut-front/react/routerHelper';
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
import { prepateRuleToSave } from '../helpers';
import HistoryLog from 'ut-audit/modules/history/ui/react/containers/HistoryLog';
let status = fromJS({
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
            closeAfterSave: false
        };
    }
    fetchData() {
        let { fetchNomenclatures, changeRuleProfile, getRule } = this.props.actions;
        let { nomenclatureConfiguration, config, params, remoteRule } = this.props;
        let { nomenclaturesFetched } = config || {};
        changeRuleProfile(mode, params.id);
        !remoteRule && getRule(this.props.params.id);
        !nomenclaturesFetched && fetchNomenclatures(nomenclatureConfiguration);
    }
    componentWillMount() {
        this.fetchData();
    }
    getTitle(remoteRule) {
        return remoteRule ? baseTabTitle.concat(' - ', ((remoteRule.condition || [])[0] || {}).priority) : baseTabTitle;
    }
    componentWillReceiveProps(nextProps) {
        let { id } = nextProps.params;
        let { remoteRule, updateTabTitle } = nextProps;
        let { changeRuleProfile, getRule } = this.props.actions;
        if (id && id !== this.props.params.id) {
            changeRuleProfile(mode, id);
        } else if (this.props.config.id && !remoteRule && remoteRule !== this.props.remoteRule) {
            getRule(nextProps.params.id);
        }
        if (this.getTitle(remoteRule) !== this.getTitle(this.props.remoteRule)) {
            let pathname = getLink('ut-rule:edit', { id });
            updateTabTitle(pathname, this.getTitle(remoteRule));
        }
    }
    handleDialogClose() {
        this.onReset(this.state.closeAfterSave);
    }
    onSave() {
        let formattedRule = prepateRuleToSave(this.props.rule);
        this.props.actions.editRule(formattedRule);
    }
    onReset(closeAfterSave) {
        this.props.actions.resetRuleState();
        closeAfterSave && this.props.removeTab(this.props.activeTab.pathname);
    }
    getTabs() {
        let tabs = [
            {
                title: 'Channel',
                component: <Channel />
                // validations: getGeneralInfoTabValidator()
            },
            {
                title: 'Source',
                component: <Source />
            },
            {
                title: 'Operation',
                component: <Operation />
            },
            {
                title: 'Destination',
                component: <Destination />
            },
            {
                title: 'Fee and Commission Split',
                component: <Split />
            },
            {
                title: 'Limit',
                component: <Limit />
            }
        ];
        if (this.context.checkPermission('history.customer.listChanges')) {
            tabs.push({
                title: 'History Log',
                component: <HistoryLog objectId={this.props.params.id} objectName={'rule'} objectDisplayName={((this.props.remoteRule.condition || [])[0] || {}).priority} />
            });
        }
        return tabs;
    }
    getActionButtons() {
        let create = () => {
            this.state.closeAfterSave && this.setState({
                closeAfterSave: false
            });
            this.onSave();
        };
        let createAndClose = () => {
            this.setState({
                closeAfterSave: true
            });
            this.onSave();
        };
        let actionButtons = [
            {
                text: 'Save and Close',
                performFullValidation: true,
                onClick: createAndClose,
                styleType: 'primaryLight'
            }, {
                text: 'Save',
                performFullValidation: true,
                onClick: create
            }, {
                text: 'Close',
                onClick: () => {
                    return this.onReset(true);
                }
            }
        ];
        return actionButtons;
    }
    renderTabContainer() {
        return (
            <TabContainer
              headerTitle={this.getTitle(this.props.remoteRule)}
              tabs={this.getTabs()}
              actionButtons={this.getActionButtons()}
            />
        );
    }
    render() {
        let { ruleSaved } = this.props.config;
        let { id } = this.props.params;
        return (
            <Page>
                <AddTab pathname={getLink('ut-rule:edit', { id })} title={this.getTitle(this.props.remoteRule)} />
                {ruleSaved && <StatusDialog status={status} onClose={this.handleDialogClose} />}
                <Container>
                    <Content style={{position: 'relative'}}>
                        {this.renderTabContainer()}
                    </Content>
                </Container>
            </Page>
        );
    }
}

RuleEdit.contextTypes = {
    checkPermission: PropTypes.func
};

RuleEdit.propTypes = {
    rule: PropTypes.object,
    params: PropTypes.object,
    actions: PropTypes.object,
    activeTab: PropTypes.object,
    updateTabTitle: PropTypes.func.isRequired,
    removeTab: PropTypes.func.isRequired,
    config: PropTypes.object,
    remoteRule: PropTypes.object,
    nomenclatureConfiguration: PropTypes.shape({}).isRequired
};

RuleEdit.defaultProps = {};

const mapStateToProps = (state, ownProps) => {
    let tabState = state.ruleProfileReducer.getIn([mode, ownProps.params.id]);
    return {
        activeTab: state.tabMenu.active,
        config: state.ruleProfileReducer.get('config').toJS(),
        nomenclatureConfiguration: state.uiConfig.get('nomenclatures').toJS(),
        rule: tabState ? tabState.toJS() : {},
        remoteRule: state.ruleProfileReducer.getIn(['rules', ownProps.params.id])
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    removeTab: bindActionCreators(removeTab, dispatch),
    updateTabTitle: bindActionCreators(updateTabTitle, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleEdit);
