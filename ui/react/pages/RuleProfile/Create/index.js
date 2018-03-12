import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS } from 'immutable';
import { AddTab } from 'ut-front-react/containers/TabMenu';
import { getLink } from 'ut-front/react/routerHelper';
import { removeTab } from 'ut-front-react/containers/TabMenu/actions';
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
import { prepateRuleToSave, prepareRuleErrors, isEmptyValuesOnly, getRuleErrorCount, tabTitleMap } from '../helpers';

let status = fromJS({
    status: 'SUCCESS',
    message: 'Rule successfully created'
});
const mode = 'create';
const id = 'create';

class RuleCreate extends Component {
    constructor(props, context) {
        super(props, context);
        this.onSave = this.onSave.bind(this);
        this.fetchData = this.fetchData.bind(this);
        // this.updateRuleErrors = this.updateRuleErrors.bind(this);
        this.onReset = this.onReset.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.state = {
            closeAfterSave: false,
            showErrorStatus: false
        };
    }

    fetchData() {
        let { fetchNomenclatures, changeRuleProfile } = this.props.actions;
        let { nomenclatureConfiguration, config } = this.props;
        let { nomenclaturesFetched } = config || {};
        changeRuleProfile(mode, id);
        !nomenclaturesFetched && fetchNomenclatures(nomenclatureConfiguration);
    }

    componentWillMount() {
        this.fetchData();
    }
    handleDialogClose() {
        this.onReset(this.state.closeAfterSave);
    }
    onSave() {
        let formattedRule = prepateRuleToSave(this.props.rule);
        this.props.actions.createRule(formattedRule);
    }

    onReset(closeAfterSave) {
        this.props.actions.resetRuleState();
        closeAfterSave && this.props.removeTab(this.props.activeTab.pathname);
    }

    getTabs() {
        let errorCount = getRuleErrorCount(this.props.errors.toJS());
        let tabs = [
            {
                title: 'Channel',
                component: <Channel />,
                errorsCount: errorCount.channel
            },
            {
                title: 'Operation',
                component: <Operation />,
                errorsCount: errorCount.operation
            },
            {
                title: 'Source',
                component: <Source />,
                errorsCount: errorCount.source
            },
            {
                title: 'Destination',
                component: <Destination />,
                errorsCount: errorCount.destination
            },
            {
                title: 'Limit',
                component: <Limit />,
                errorsCount: errorCount.limit
            },
            {
                title: 'Fee and Commission Split',
                component: <Split />,
                errorsCount: errorCount.split
            }
        ];
        return tabs;
    }

    getActionButtons() {
        let { errors, rule } = this.props;
        let newErrors = prepareRuleErrors(rule, errors.toJS());
        let isValid = isEmptyValuesOnly(newErrors);
        let showError = () => {
            !isEmptyValuesOnly(newErrors) && this.props.actions.updateRuleErrors(newErrors);
            this.setState({showErrorStatus: true});
        };
        let create = () => {
            if (!isValid) return showError();
            this.state.closeAfterSave && this.setState({
                closeAfterSave: false
            });
            this.onSave();
        };
        let createAndClose = () => {
            if (!isValid) return showError();
            this.setState({
                closeAfterSave: true
            });
            this.onSave();
        };
        let actionButtons = [{
            text: 'Close',
            onClick: () => {
                return this.onReset(true);
            }
        }];
        this.context.checkPermission('rule.rule.add') && actionButtons.unshift({
            text: 'Create',
            performFullValidation: true,
            onClick: create
        }) && actionButtons.unshift({
            text: 'Create and Close',
            onClick: createAndClose,
            performFullValidation: true,
            styleType: 'primaryLight'
        });
        return actionButtons;
    }
    renderTabContainer() {
        return (
            <TabContainer
              ref={`tab_container_${mode}_${id}`}
              headerTitle='Create Rule'
              onTabClick={this.props.actions.changeActiveTab}
              active={this.props.rule.activeTab}
              tabs={this.getTabs()}
              actionButtons={this.getActionButtons()}
            />
        );
    }
    renderErrorStatusDialog() {
        let errorCount = getRuleErrorCount(this.props.errors.toJS());
        let totalErrors = 0;
        let totalErrorTabs = 0;
        let tabErrorMsg = '';
        let close = () => {
            this.setState({showErrorStatus: false});
        };
        for (var key in errorCount) {
            if (errorCount[key]) {
                totalErrorTabs++;
                totalErrors += errorCount[key];
                let currentErrorString = errorCount[key] > 1 ? 'errors' : 'error';
                tabErrorMsg += `<li>${tabTitleMap[key]}: ${errorCount[key]} ${currentErrorString}</li>`;
            }
        }
        let errorString = totalErrors > 1 ? 'errors' : 'error';
        let tabString = totalErrorTabs > 1 ? 'tabs' : 'tab';
        let statusErrorMessage = `Your request can not be saved because you have ${errorString} in the following ${tabString}:<ul>${tabErrorMsg}</ul>`;
        return <StatusDialog onClose={close} status={fromJS({status: 'failed', message: statusErrorMessage})} />;
    }
    render() {
        let { ruleSaved } = this.props.config;
        return (
            <Page>
                <AddTab pathname={getLink('ut-rule:create')} title='Create Rule' />
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

RuleCreate.propTypes = {
    rule: PropTypes.object,
    errors: PropTypes.object,
    actions: PropTypes.object,
    activeTab: PropTypes.object,
    removeTab: PropTypes.func.isRequired,
    config: PropTypes.object,
    nomenclatureConfiguration: PropTypes.shape({}).isRequired
};

RuleCreate.defaultProps = {};

const mapStateToProps = (state, ownProps) => {
    let tabState = state.ruleProfileReducer.getIn([mode, id]);
    return {
        activeTab: state.tabMenu.active,
        config: state.ruleProfileReducer.get('config').toJS(),
        nomenclatureConfiguration: state.uiConfig.get('nomenclatures').toJS(),
        rule: tabState ? tabState.toJS() : {},
        errors: state.ruleProfileReducer.getIn([mode, id, 'errors']) || fromJS({})
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    removeTab: bindActionCreators(removeTab, dispatch)
});

RuleCreate.contextTypes = {
    checkPermission: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(RuleCreate);
