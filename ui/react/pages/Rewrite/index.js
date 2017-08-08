import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import {getLink} from 'ut-front/react/routerHelper';
import mainStyle from 'ut-front-react/assets/index.css';
import { AddTab } from 'ut-front-react/containers/TabMenu';
import Header from 'ut-front-react/components/PageLayout/Header';

import * as actions from './actions';

import Grid from '../../components/Grid';
import Dialog from '../../components/Dialog';
import Prompt from '../../components/Prompt';

class RuleManagement extends React.Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
    }

    fetchData() {
        const { fetchRules, fetchNomenclatures } = this.props.actions;
        const { nomenclatureConfiguration } = this.props;
        fetchRules();
        fetchNomenclatures(nomenclatureConfiguration);
    }

    componentDidMount() {
        this.fetchData();
    }

    getHeaderButtons() {
        let buttons = [];
        buttons.push({text: 'Create Rule', href: getLink('ut-rule:detail'), onClick: () => {}});
        return buttons;
    }

    renderHeader() {
        return (
            <div>
                <Header text='Rule Management' buttons={this.getHeaderButtons()} />
            </div>
        );
    }

    // renderGridToolbox() {
    //     return (
    //         <div className={classnames(mainStyle.actionBarWrap, style.actionBarWrap)}>
    //             <Toolbox />
    //         </div>
    //     );
    // }

    render() {
        return (
            <div className={mainStyle.contentTableWrap}>
                <AddTab pathname={getLink('ut-rule:rewrite')} title='Rule Management 2' />
                {this.renderHeader()}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        rule: state.ruleRewriteReducer.get('rule').toJS(),
        nomenclatureConfiguration: state.uiConfig.get('nomenclatures').toJS()
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleManagement);
