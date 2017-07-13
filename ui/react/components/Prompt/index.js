import Dialog from 'material-ui/Dialog';
import React, { PropTypes } from 'react';

export default React.createClass({
    propTypes: {
        open: PropTypes.bool,
        message: PropTypes.string,
        onOk: PropTypes.func,
        onCancel: PropTypes.func
    },
    render() {
        let actions = [];

        if (this.props.onOk) {
            actions.push(<button className='button btn btn-primary' onClick={this.props.onOk} style={{ marginRight: '10px' }}>OK</button>);
        }

        if (this.props.onCancel) {
            actions.push(<button className='button btn btn-primary' onClick={this.props.onCancel}>Cancel</button>);
        }

        return (
            <Dialog
              open={this.props.open}
              autoScrollBodyContent
              actions={actions}
              >
                <div style={{padding: '10px'}}>
                   {this.props.message}
                </div>
            </Dialog>
        );
    }
});
