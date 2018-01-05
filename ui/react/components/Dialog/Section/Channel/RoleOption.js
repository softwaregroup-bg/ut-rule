import React, { Component } from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

export default class RenderOption extends Component {
    constructor() {
        super();

        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    handleMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onRemove(this.props.value, event);
    }

    render() {
        let label = Array.isArray(this.props.children) && this.props.children[0] && typeof (this.props.children[0]) === 'string' ? this.props.children[0] : this.props.value.label;
        // Check whether the role is deleted.
        let isDeleted = /( )deleted( )([A-z]){3}( )/g.test(label);
        // If it is deleted remove the label part of it.
        if (isDeleted) {
            label = label.slice(0, label.indexOf(' deleted '));
        }

        let children = [];
        children[0] = label;
        for (let i = 1; i < this.props.children.length; i++) {
            children.push(this.props.children[i]);
        }

        return (
            <span className={isDeleted ? style.deletedStyle : null} >
                <span className='Select-value' title={this.props.value.label} >
                    <span className='Select-value-icon' onMouseDown={this.handleMouseDown}>
                        {'x'}
                    </span>
                    <span className='Select-value-label'>
                        {children}
                    </span>
                </span>
            </span>
        );
    }
}

RenderOption.propTypes = {
    value: PropTypes.object,
    children: PropTypes.node,
    onRemove: PropTypes.func
};
