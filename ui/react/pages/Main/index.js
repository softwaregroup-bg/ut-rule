import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Grid from '../../components/Grid';
import FlatButton from 'material-ui/FlatButton';
import Dialog from '../../components/Dialog';
import MaterialDialog from 'material-ui/Dialog';
// import Prompt from '../../components/Prompt';
import mainStyle from 'ut-front-react/assets/index.css';
import { AddTab } from 'ut-front-react/containers/TabMenu';
import Header from 'ut-front-react/components/PageLayout/Header';
import GridToolbox from 'ut-front-react/components/SimpleGridToolbox';
import classnames from 'classnames';
import style from './style.css';
import * as actionCreators from './actionCreators';

const Main = React.createClass({
    propTypes: {
        rules: PropTypes.object,
        nomenclatures: PropTypes.object,
        ready: PropTypes.bool,
        empty: PropTypes.bool,
        actions: PropTypes.object,
        location: PropTypes.object,
        uiConfig: PropTypes.object,
        columns: PropTypes.object,
        sections: PropTypes.object
    },
    contextTypes: {
        checkPermission: PropTypes.func
    },
    getInitialState() {
        return {
            selectedConditions: {},
            canEdit: false,
            canDelete: false,
            prompt: false,
            dialog: {
                open: false,
                conditionId: null
            },
            uiConfig: this.props.uiConfig.toJS()
        };
    },
    fetchData() {
        this.props.actions.fetchRules();
        this.props.actions.fetchNomenclatures(this.state.uiConfig.nomenclatures);
    },
    componentWillMount() {
        this.fetchData();
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.empty) {
            this.fetchData();
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.ready;
    },
    handleCheckboxSelect(isSelected, data) {
        let selectedConditions = []; // this.state.selectedConditions;
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
    createBtnOnClick() {
        this.setState({
            dialog: {
                open: true,
                conditionId: null
            }
        });
    },
    editBtnOnClick() {
        this.setState({
            dialog: {
                open: true,
                conditionId: Object.keys(this.state.selectedConditions)[0]
            }
        });
    },
    dialogOnClose() {
        this.setState({
            dialog: {
                open: false,
                conditionId: null
            }
        });
    },
    dialogOnSave(data) {
        let action = this.state.dialog.conditionId ? 'editRule' : 'addRule';
        // Trigger the action & if it comes back with no error -> clear the dialog;
        // otherwise - keep the data, as we don't want the user to have to input it again
        if (data && data.limit) {
            data.limit.forEach(lim => {
                Object.keys(lim).forEach(key => {
                    if (lim[key] === '') {
                        lim[key] = null;
                    }
                });
            });
        }

        return this.props.actions[action](data).then(result => {
            if (!result.error) {
                this.setState(this.getInitialState());
            }
            return true;
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
    showPrompt() {
        this.setState({
            prompt: true
        });
    },
    hidePrompt() {
        this.setState({
            prompt: false
        });
    },
    render() {
        if (!this.props.ready) {
            return null;
        }

        let uiConfig = this.state.uiConfig;
        let columns = uiConfig.main.grid.columns;
        let sections = uiConfig.dialog.sections;

        const actions = [
            <FlatButton
                label='Cancel'
                primary
                onClick={this.hidePrompt}
            />,
            <FlatButton
                label='Delete'
                primary
                onClick={this.removeRules}
            />
        ];

        return <div className={mainStyle.contentTableWrap}>
            <AddTab pathname={this.props.location.pathname} title='Rule Management' />
            <div className={style.header}>
                <Header text='Rule Management' buttons={[{ text: 'Create Rule', onClick: this.createBtnOnClick, permissions: ['rule.rule.add'] }]} />
            </div>
            <div className={classnames(mainStyle.tableWrap, style.tableWrap)}>
                <div className={classnames(mainStyle.actionBarWrap, style.actionBarWrap)}>
                    <GridToolbox opened title='' >
                        <div className={style.gridToolBoxButtons}>
                            {this.context.checkPermission('rule.rule.edit') &&
                                <button onClick={this.editBtnOnClick} className='button btn btn-primary' disabled={!this.state.canEdit}>
                                    Edit
                                </button>
                            }
                            {this.context.checkPermission('rule.rule.remove') &&
                                <button onClick={this.showPrompt} className={classnames('button btn btn-primary', style.deleteButton)} disabled={!this.state.canEdit}>
                                    Delete
                                </button>
                            }
                        </div>
                    </GridToolbox>
                </div>
                <div className={style.grid} >
                    {this.state.dialog.open &&
                        <Dialog
                            ref='dialog'
                            open={this.state.dialog.open}
                            data={this.props.rules[this.state.dialog.conditionId]}
                            nomenclatures={this.props.nomenclatures}
                            onSave={this.dialogOnSave}
                            onClose={this.dialogOnClose}
                            sections={sections}
                        />
                    }
                    {/* {this.state.prompt &&
                        <Prompt
                            ref='prompt'
                            open={this.state.prompt}
                            message={
                                'You are about to delete ' +
                                (
                                    Object.keys(this.state.selectedConditions).length === 1
                                        ? '1 rule'
                                        : Object.keys(this.state.selectedConditions).length + ' rules'
                                ) +
                                '. Would you like to proceed?'
                            }
                            onOk={this.removeRules}
                            onCancel={this.hidePrompt}
                        />
                    } */}
                    {this.state.prompt &&
                        <MaterialDialog
                            ref='deleteComfirmDialog'
                            title='WARNING'
                            actions={actions}
                            modal={false}
                            open={this.state.prompt}
                            onRequestClose={this.hidePrompt}
                        >
                            {'You are about to delete ' +
                                (
                                    Object.keys(this.state.selectedConditions).length === 1
                                        ? '1 rule'
                                        : Object.keys(this.state.selectedConditions).length + ' rules'
                                ) +
                                '. Would you like to proceed?'
                            }
                        </MaterialDialog>
                    }
                    <Grid
                        ref='grid'
                        refresh={this.refresh}
                        data={this.props.rules}
                        selectedConditions={this.state.selectedConditions}
                        nomenclatures={this.props.nomenclatures}
                        handleCheckboxSelect={this.handleCheckboxSelect}
                        handleHeaderCheckboxSelect={this.handleHeaderCheckboxSelect}
                        columns={columns}
                    />
                </div>
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
        </div>;
    }
});

export default connect(
    (state, ownProps) => {
        return {
            rules: state.main.fetchRules,
            nomenclatures: state.main.fetchNomenclatures,
            ready: !!(state.main.fetchRules && state.main.fetchNomenclatures),
            empty: Object.keys(state.main).length === 0,
            uiConfig: state.uiConfig
        };
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(actionCreators, dispatch)
        };
    }
)(Main);
