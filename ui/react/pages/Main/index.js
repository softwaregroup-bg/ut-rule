import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Grid from '../../components/Grid';
import Dialog from '../../components/Dialog';
import mainStyle from 'ut-front-react/assets/index.css';
// import style from './style.css';
import * as actionCreators from './actionCreators';

const Main = React.createClass({
    propTypes: {
        data: PropTypes.shape({
            rules: PropTypes.object,
            nomenclatures: PropTypes.object
        }),
        actions: PropTypes.object
    },
    getInitialState() {
        return {
            selectedConditions: {},
            canEdit: false,
            canDelete: false,
            dialog: {
                open: false,
                conditionId: null
            }
        };
    },
    fetchData() {
        this.props.actions.fetchRules();
        this.props.actions.fetchNomenclatures();
    },
    componentWillMount() {
        this.fetchData();
    },
    componentWillReceiveProps(nextProps) {
        if (!nextProps.data) {
            this.fetchData();
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        return !!nextProps.data;
    },
    handleCheckboxSelect(isSelected, data) {
        let selectedConditions = this.state.selectedConditions;
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
    handleHeaderCheckboxSelect(isSelected, data) {
        this.setState({
            selectedConditions: isSelected ? {} : data.reduce((all, item) => { all[item.id] = true; return all; }, {}),
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
    dialogOnSave() {
        this.dialogOnClose();
    },
    deleteBtnOnClick() {
        return this.props.actions.removeRules({
            conditionId: Object.keys(this.state.selectedConditions).map((key) => (parseInt(key, 10)))
        }).then(() => this.props.actions.fetchRules());
    },
    render() {
        if (!this.props.data) {
            return null;
        }
        return <div className={mainStyle.contentTableWrap}>
            <div className={mainStyle.actionBarWrap}>
                <div style={{padding: '15px 10px 0 0', float: 'right'}}>
                    <button onClick={this.createBtnOnClick}>Create Rule</button>
                </div>
            </div>
            <div className={mainStyle.tableWrap} style={{margin: 0, position: 'static'}}>
                <div style={{float: 'right', padding: '20px 0'}}>
                    <button onClick={this.editBtnOnClick} style={{visibility: this.state.canEdit ? 'visible' : 'hidden'}}>
                      Edit
                    </button>
                    <button onClick={this.deleteBtnOnClick} style={{marginLeft: '20px', visibility: this.state.canDelete ? 'visible' : 'hidden'}}>
                      Delete
                    </button>
                </div>
                { this.state.dialog.open &&
                    <Dialog
                      ref='dialog'
                      open={this.state.dialog.open}
                      data={this.props.data.rules[this.state.dialog.conditionId]}
                      onSave={this.dialogOnSave}
                      onClose={this.dialogOnClose}
                    />
                }
                <Grid
                  ref='grid'
                  data={this.props.data.rules}
                  nomenclatures={this.props.data.nomenclatures}
                  handleCheckboxSelect={this.handleCheckboxSelect}
                  handleHeaderCheckboxSelect={this.handleHeaderCheckboxSelect}
                />
            </div>
            {true &&
                <div>
                    <div style={{float: 'left', padding: '50px'}}>
                        RULES <br /><hr /><br /><pre>{JSON.stringify(this.props.data.rules, null, 2)}</pre>
                    </div>
                    <div style={{float: 'left', padding: '50px'}}>
                        NOMENCLATURES <br /><hr /><br /><pre>{JSON.stringify(this.props.data.nomenclatures, null, 2)}</pre>
                    </div>
                </div>
            }
        </div>;
    }
});

const formatRules = function(data) {
    return Object.keys(data).reduce(function(all, key) {
        data[key].forEach(function(record) {
            if (!record) {
                return;
            }
            if (!all[record.conditionId]) {
                all[record.conditionId] = {};
            }
            if (!all[record.conditionId][key]) {
                all[record.conditionId][key] = [];
            }
            all[record.conditionId][key].push(record);
        });
        return all;
    }, {});
};

const formatNomenclatures = function(data) {
    return data.reduce(function(all, record) {
        if (!all[record.type]) {
            all[record.type] = {};
        }
        all[record.type][record.value] = record.display;
        return all;
    }, {});
};

export default connect(
    (state, ownProps) => {
        if (state.main.fetchRules && state.main.fetchNomenclatures) {
            return {
                data: {
                    rules: formatRules(state.main.fetchRules),
                    nomenclatures: formatNomenclatures(state.main.fetchNomenclatures)
                }
            };
        }
        return {
            data: ownProps.data
        };
    },
    (dispatch) => ({
        actions: bindActionCreators(actionCreators, dispatch)
    })
)(Main);
