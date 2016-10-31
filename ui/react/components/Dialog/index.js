import Dialog from 'material-ui/Dialog';
import React, { PropTypes } from 'react';
import Accordion from 'ut-front-react/components/Accordion';
import style from './style.css';
// import Input from 'ut-front-react/components/Input';
// import Dropdown from 'ut-front-react/components/Input/Dropdown';

export default React.createClass({
    propTypes: {
        open: PropTypes.bool,
        data: PropTypes.object,
        nomenclatures: PropTypes.object,
        onSave: PropTypes.func,
        onClose: PropTypes.func
    },
    getInitialState() {
        return {

        };
    },
    render() {
        return (<Dialog
          title={this.props.data ? 'Edit Rule' : 'Add Rule'}
          open={this.props.open}
          autoScrollBodyContent
          contentStyle={style}
          actions={[
              <button onClick={this.props.onSave} style={{marginRight: '10px'}}>Save</button>,
              <button onClick={this.props.onClose}>Cancel</button>
          ]}
        >
            <div>
                <div className={style.topSection}>
                    Status
                </div>
                <div className={style.wrapper}>
                    <Accordion title='Channel' fullWidth>
                        <div className={style.content}>
                            aaa
                        </div>
                    </Accordion>
                    <Accordion title='Operation' fullWidth>
                        <div className={style.content}>
                            aaa
                        </div>
                    </Accordion>
                    <Accordion title='Source' fullWidth>
                        <div className={style.content}>
                            aaa
                        </div>
                    </Accordion>
                    <Accordion title='Destination' fullWidth>
                        <div className={style.content}>
                            aaa
                        </div>
                    </Accordion>
                    <Accordion title='Fee' fullWidth>
                        <div className={style.content}>
                            aaa
                        </div>
                    </Accordion>
                    <Accordion title='Limit' fullWidth>
                        <div className={style.content}>
                            aaa
                        </div>
                    </Accordion>
                    <Accordion title='Summary' fullWidth>
                        <div className={style.content}>
                            aaa
                        </div>
                    </Accordion>
                </div>
            </div>
        </Dialog>);
    }
});
