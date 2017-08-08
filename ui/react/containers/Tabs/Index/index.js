import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import immutable from 'immutable'; // WTF

import { AddTab } from 'ut-front-react/containers/TabMenu';
// import { removeTab } from 'ut-front-react/containers/TabMenu/actions';
import { getLink } from 'ut-front/react/routerHelper';

import Page from 'ut-front-react/components/PageLayout/Page';
import Container from 'ut-front-react/components/PageLayout/Container';
import Content from 'ut-front-react/components/PageLayout/Content';
import TabContainer from 'ut-front-react/containers/TabContainer';

import Channel from '../Channel';
import Source from '../Source';
import Operation from '../Operation';
import Destination from '../Destination';
import Split from '../Split';
import Limit from '../Limit';
import * as actions from './actions';

import { prepateRuleToSave } from './helpers';

const propTypes = {

};

const defaultProps = {

};

class RuleTabDetail extends Component {
    constructor(props, context) {
        super(props, context);
        this.onSave = this.onSave.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    fetchData() {
        const { fetchRules, fetchNomenclatures } = this.props.actions;
        const { nomenclatureConfiguration } = this.props;
        fetchRules();
        fetchNomenclatures(nomenclatureConfiguration);
    }

    componentWillMount() {
        this.fetchData();
    }

    async onSave() {
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
        const result = await this.props.actions.createRule(formattedRule);
        debugger;
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
        let actionButtons = [
            {
                text: 'Create and Close', 
                performFullValidation: true,
                onClick: this.onSave,
                styleType: 'primaryLight'
            },
            { text: 'Close', onClick: () => {} }
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

RuleTabDetail.propTypes = propTypes;
RuleTabDetail.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => ({
    nomenclatureConfiguration: state.uiConfig.get('nomenclatures').toJS(),
    destination: state.ruleDestinationTabReducer.get('fields').toJS(),
    source: state.ruleSourceTabReducer.get('fields').toJS(),
    operation: state.ruleOperationTabReducer.get('fields').toJS(),
    channel: state.ruleChannelTabReducer.get('fields').toJS(),
    split: state.ruleSplitTabReducer.get('fields').toJS(),
    limit: state.ruleLimitTabReducer.get('fields').toJS()
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleTabDetail);
