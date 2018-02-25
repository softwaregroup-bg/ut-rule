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
    message: 'Rule successfully created'
});
const mode = 'create';
const id = 'create';

class RuleCreate extends Component {
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
                text: 'Create and Close',
                performFullValidation: true,
                onClick: createAndClose,
                styleType: 'primaryLight'
            }, {
                text: 'Create',
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
              headerTitle='Create Rule'
              tabs={this.getTabs()}
              actionButtons={this.getActionButtons()}
            />
        );
    }

    render() {
        let { ruleSaved } = this.props.config;
        return (
            <Page>
                <AddTab pathname={getLink('ut-rule:create')} title='Create Rule' />
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

RuleCreate.propTypes = {
    rule: PropTypes.object,
    actions: PropTypes.shape({
        fetchNomenclatures: PropTypes.func,
        createRule: PropTypes.func,
        resetRuleState: PropTypes.func,
        changeRuleProfile: PropTypes.func
    }).isRequired,
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
        rule: tabState ? tabState.toJS() : {}
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    removeTab: bindActionCreators(removeTab, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleCreate);
