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
var status = fromJS({
    status: 'SUCCESS',
    message: 'Rule successfully created'
});
import { prepateRuleToSave } from '../helpers';

const propTypes = {
    destination: PropTypes.object,
    source: PropTypes.object,
    operation: PropTypes.object,
    channel: PropTypes.object,
    split: PropTypes.object,
    limit: PropTypes.array,
    actions: PropTypes.shape({
        fetchNomenclatures: PropTypes.func,
        createRule: PropTypes.func,
        resetRuleState: PropTypes.func
    }).isRequired,
    activeTab: PropTypes.object,
    removeTab: PropTypes.func.isRequired,
    config: PropTypes.object,
    nomenclatureConfiguration: PropTypes.shape({}).isRequired
};

const defaultProps = {

};

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
        let { fetchNomenclatures } = this.props.actions;
        let { nomenclatureConfiguration, config } = this.props;
        let { nomenclaturesFetched } = config || {};
        !nomenclaturesFetched && fetchNomenclatures(nomenclatureConfiguration);
    }

    componentWillMount() {
        this.fetchData();
    }
    handleDialogClose() {
        this.onReset(this.state.closeAfterSave);
    }
    onSave() {
        const {
            destination,
            source,
            operation,
            channel,
            split,
            limit
        } = this.props;

        let formattedRule = prepateRuleToSave({
            destination,
            source,
            operation,
            channel,
            split,
            limit
        });
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

RuleCreate.propTypes = propTypes;
RuleCreate.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => () => {
    debugger;
    return {
        activeTab: state.tabMenu.active,
        nomenclatureConfiguration: state.uiConfig.get('nomenclatures').toJS(),
        destination: state.ruleProfileReducer.get('destination').toJS(),
        source: state.ruleProfileReducer.get('source').toJS(),
        operation: state.ruleProfileReducer.get('operation').toJS(),
        channel: state.ruleProfileReducer.get('channel').toJS(),
        split: state.ruleProfileReducer.get('split').toJS(),
        limit: state.ruleProfileReducer.get('limit').toJS(),
        config: state.ruleProfileReducer.get('config').toJS()
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    removeTab: bindActionCreators(removeTab, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleCreate);
