import Dialog from 'material-ui/Dialog';
import React, { PropTypes } from 'react';
import style from './style.css';

export default React.createClass({
    propTypes: {
        open: PropTypes.bool,
        data: PropTypes.object,
        onSave: PropTypes.func,
        onClose: PropTypes.func
    },
    render() {
        return <Dialog
          title={'Title'}
          open={this.props.open}
          autoScrollBodyContent
          contentStyle={style}
          actions={[
              <button onClick={this.props.onSave}>Save</button>,
              <button onClick={this.props.onClose}>Cancel</button>
          ]}
        >
            {JSON.stringify(this.props.data)}
        </Dialog>;
    }
});
