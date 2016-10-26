import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actionCreators';

const Main = React.createClass({
    propTypes: {
        data: PropTypes.array,
        actions: PropTypes.object
    },
    componentWillMount() {
        this.props.actions.fetch();
    },
    componenntWillReceiveProps(nextProps) {

    },
    render() {
        if (this.props.data) {
            // handle data e.g. render in grid
        }
        return (
            <div style={{
                height: '100%',
                padding: '50px',
                textAlign: 'center',
                color: '#555',
                fontSize: '30px'
            }}>
                UT-Rule Web Interface
            </div>
        );
    }
});

function formatData(data) {
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
}

export default connect(
    (state) => ({
        data: state.main.fetch && formatData(state.main.fetch)
    }),
    (dispatch) => ({
        actions: bindActionCreators(actionCreators, dispatch)
    })
)(Main);
