import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AddTab } from 'ut-front-react/containers/TabMenu';
import { getLink } from 'ut-front/react/routerHelper';
import { removeTab } from 'ut-front-react/containers/TabMenu/actions';

import Page from 'ut-front-react/components/PageLayout/Page';
import Container from 'ut-front-react/components/PageLayout/Container';
import Content from 'ut-front-react/components/PageLayout/Content';
import TabContainer from 'ut-front-react/containers/TabContainer';

import Channel from '../Tabs/Channel';
import Source from '../Tabs/Source';
import Operation from '../Tabs/Operation';
import Destination from '../Tabs/Destination';
import Split from '../Tabs/Split';
import Limit from '../Tabs/Limit';
import * as actions from '../actions';

import { prepateRuleToSave } from '../helpers';

const propTypes = {
    destination: PropTypes.object,
    source: PropTypes.object,
    operation: PropTypes.object,
    channel: PropTypes.object,
    split: PropTypes.object,
    limit: PropTypes.object,
    actions: PropTypes.shape({
        fetchNomenclatures: PropTypes.func,
        createRule: PropTypes.func,
        resetRuleState: PropTypes.func
    }).isRequired,
    activeTab: PropTypes.object,
    removeTab: PropTypes.func.isRequired,
    nomenclaturesFetched: PropTypes.bool,
    nomenclatureConfiguration: PropTypes.shape({}).isRequired
};

const defaultProps = {

};

class RuleCreate extends Component {
    constructor(props, context) {
        super(props, context);
        this.onSave = this.onSave.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    fetchData() {
        const { fetchNomenclatures } = this.props.actions;
        const { nomenclatureConfiguration, nomenclaturesFetched } = this.props;
        !nomenclaturesFetched && fetchNomenclatures(nomenclatureConfiguration);
    }

    componentWillMount() {
        this.fetchData();
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

    onClose() {
        this.props.actions.resetRuleState();
        this.props.removeTab(this.props.activeTab.pathname);
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
            // this.setState({
            //     resetState: true
            // });
            this.onSave();
        };
        let createAndClose = () => {
            // this.setState({
            //     resetState: true,
            //     closeTab: true
            // });
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
                onClick: this.onClose
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
        return (
            <Page>
                <AddTab pathname={getLink('ut-rule:create')} title='Create Rule' />
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

const mapStateToProps = (state, ownProps) => ({
    activeTab: state.tabMenu.active,
    nomenclatureConfiguration: state.uiConfig.get('nomenclatures').toJS(),
    destination: state.ruleDestinationTabReducer.get('fields').toJS(),
    source: state.ruleSourceTabReducer.get('fields').toJS(),
    operation: state.ruleOperationTabReducer.get('fields').toJS(),
    channel: state.ruleChannelTabReducer.get('fields').toJS(),
    split: state.ruleSplitTabReducer.get('fields').toJS(),
    limit: state.ruleLimitTabReducer.get('fields').toJS(),
    nomenclaturesFetched: state.ruleTabReducer.get('nomenclaturesFetched')
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    removeTab: bindActionCreators(removeTab, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleCreate);
