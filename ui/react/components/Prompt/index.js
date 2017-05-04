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
        return (
            <Dialog
              open={this.props.open}
              autoScrollBodyContent
              actions={[
                  <button className='button btn btn-primary' onClick={this.props.onOk} style={{ marginRight: '10px' }}>OK</button>,
                  <button className='button btn btn-primary' onClick={this.props.onCancel}>Cancel</button>
              ]}
              >
                <div style={{padding: '10px'}}>
                   {this.props.message}
                </div>
            </Dialog>
        );
    }
});
