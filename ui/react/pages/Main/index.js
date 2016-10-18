import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionTypes from './actionTypes';
import * as actionCreators from './actionCreators';

const Main = React.createClass({
    propTypes: {
        data: PropTypes.object,
        actions: PropTypes.object
    },
    componentWillMount() {
        this.props.actions.fetch();
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

export default connect(
    (state) => ({
        data: state.main[actionTypes.FETCH].result && state.main[actionTypes.FETCH].result.data
    }),
    (dispatch) => ({
        actions: bindActionCreators(actionCreators, dispatch)
    })
)(Main);
