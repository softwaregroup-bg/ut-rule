import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RulesTable from '../../components/RulesTable';
import * as actionCreators from './actionCreators';

const Main = React.createClass({
    propTypes: {
        rules: PropTypes.array,
        nomenclatures: PropTypes.object,
        actions: PropTypes.object
    },
    componentWillMount() {
        return this.props.actions.fetchRules()
            .then(() => {
                return this.props.actions.fetchNomenclatures();
            });
    },
    render() {
        if (this.props.rules && this.props.nomenclatures) {
            return <div>
                <RulesTable data={this.props.rules} nomenclatures={this.props.nomenclatures} />
                <div>
                    <div style={{float: 'left', padding: '50px'}}>
                        RULES <br /><hr /><br /><pre>{JSON.stringify(this.props.rules, null, 2)}</pre>
                    </div>
                    <div style={{float: 'left', padding: '50px'}}>
                        NOMENCLATURES <br /><hr /><br /><pre>{JSON.stringify(this.props.nomenclatures, null, 2)}</pre>
                    </div>
                </div>
            </div>;
        }
        return null;
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
    (state) => ({
        rules: state.main.rules && formatRules(state.main.rules),
        nomenclatures: state.main.nomenclatures && formatNomenclatures(state.main.nomenclatures)
    }),
    (dispatch) => ({
        actions: bindActionCreators(actionCreators, dispatch)
    })
)(Main);
