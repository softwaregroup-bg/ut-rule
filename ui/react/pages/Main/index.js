import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchData } from './actions';

const Home = React.createClass({
    propTypes: {
        data: PropTypes.object
    },
    render() {
        return (
            <div style={{
                height: '100%',
                padding: '50px',
                textAlign: 'center',
                color: '#555',
                fontSize: '30px'
            }}>
               UT-Rule Module Web Interface
            </div>
        );
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        data: state.main
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchData: (params) => dispatch(fetchData(params))
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
};

const options = {
    pure: true,
    withRef: false
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  options
)(Home);
