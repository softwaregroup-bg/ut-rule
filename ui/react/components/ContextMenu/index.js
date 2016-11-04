import React, { PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import style from './style.css';
import ContentInbox from 'material-ui/svg-icons/content/inbox';

export default React.createClass({
    propTypes: {
        data: PropTypes.object,
        onClose: PropTypes.func,
        refresh: PropTypes.func
    },
    getInitialState() {
        return {
            shouldUpdate: true,
            contextMenu: {
                open: false,
                anchorEl: null
            },
            data: {}
        };
    },
    show(event) {
        event.preventDefault();
        this.setState({
            contextMenu: {
                open: true,
                anchorEl: event.currentTarget
            }
        });
    },
    hide() {
        this.setState({
            shouldUpdate: true,
            contextMenu: {
                open: false,
                anchorEl: null
            }
        });
        this.props.onClose(this.state.data);
    },
    shouldComponentUpdate() {
        return this.state.shouldUpdate;
    },
    componentWillMount() {
        this.setState({
            data: Object.assign({}, this.props.data)
        });
    },
    checkBoxChecked(event, checked, record) {
        let data = this.state.data;
        data[record].visible = checked;
        this.setState({
            shouldUpdate: false,
            data: data
        });
    },
    render() {
        return <div className={style.contextMenu}>
            <div onClick={this.show} className={style.icon} />
            <Popover
              open={this.state.contextMenu.open}
              anchorEl={this.state.contextMenu.anchorEl}
              autoCloseWhenOffScreen
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              onRequestClose={this.hide}
            >
                <div className={style.menu}>
                    <List ref='list'>
                        {[<ListItem primaryText='Manage Columns' leftIcon={<ContentInbox />} />].concat(Object.keys(this.state.data).map((record, i) => {
                            let checkBoxCkecked = (event, checked) => this.checkBoxChecked(event, checked, record);
                            return <ListItem
                              key={i}
                              leftCheckbox={<Checkbox
                                defaultChecked={this.state.data[record].visible}
                                onCheck={checkBoxCkecked}
                              />}
                              primaryText={this.state.data[record].title}
                            />;
                        }))}
                    </List>
                </div>
            </Popover>
        </div>;
    }
});
