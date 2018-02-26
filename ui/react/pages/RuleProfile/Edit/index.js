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
import { prepateRuleToSave } from '../helpers';
let status = fromJS({
    status: 'SUCCESS',
    message: 'Rule successfully saved'
});
const mode = 'edit';

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
        let { fetchNomenclatures, changeRuleProfile } = this.props.actions;
        let { nomenclatureConfiguration, config, params, remoteRule } = this.props;
        let { nomenclaturesFetched } = config || {};
        changeRuleProfile(mode, params.id);
        !remoteRule && this.props.actions.getRule(this.props.params.id);
        !nomenclaturesFetched && fetchNomenclatures(nomenclatureConfiguration);
    }
    componentWillMount() {
        this.fetchData();
    }
    componentWillReceiveProps(nextProps) {
        let { id } = nextProps.params;
        if (id && id !== this.props.params.id) {
            this.props.actions.changeRuleProfile(mode, nextProps.params.id);
        } else if (this.props.config.id && !nextProps.remoteRule && this.props.remoteRule !== this.props.remoteRule) {
            this.props.actions.getRule(nextProps.params.id);
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
              headerTitle='Edit Rule'
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
                <AddTab pathname={getLink('ut-rule:edit', { id })} title='Edit Rule' />
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

RuleEdit.propTypes = {
    rule: PropTypes.object,
    params: PropTypes.object,
    actions: PropTypes.object,
    activeTab: PropTypes.object,
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
    removeTab: bindActionCreators(removeTab, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleEdit);
