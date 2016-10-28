import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RulesTable from '../../components/RulesTable';
// import style from './style.css';
import * as actionCreators from './actionCreators';

const Main = React.createClass({
    propTypes: {
        data: PropTypes.shape({
            rules: PropTypes.array,
            nomenclatures: PropTypes.object
        }),
        actions: PropTypes.object
    },
    fetchData(id) {
        this.props.actions.fetchRules(id);
        this.props.actions.fetchNomenclatures();
    },
    componentWillMount() {
        this.fetchData();
    },
    componentWillReceiveProps(nextProps) {
        if (!nextProps.data) {
            this.fetchData({conditionId: 1});
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        return !!nextProps.data;
    },
    buttons: {
        create: <button>Create Rule</button>,
        edit: <button >Edit</button>,
        delete: <button>Delete</button>
    },
    render() {
        if (!this.props.data) {
            return null;
        }
        return <div>
            <button onClick={this.props.actions.reset}>Reset</button>
            <RulesTable
              ref='rules'
              data={this.props.data.rules}
              nomenclatures={this.props.data.nomenclatures}
            />
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
    var grouped = Object.keys(data).reduce(function(all, key) {
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

    return Object.keys(grouped).map(function(key) {
        return grouped[key];
    });
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
        if (state.main.rules && state.main.nomenclatures) {
            return {
                data: {
                    rules: formatRules(state.main.rules),
                    nomenclatures: formatNomenclatures(state.main.nomenclatures)
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
