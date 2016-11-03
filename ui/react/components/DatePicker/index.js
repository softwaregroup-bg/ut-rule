import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import DatePickerInput from 'material-ui/DatePicker/DatePicker';
import { formatIso } from 'material-ui/DatePicker/dateUtils';
import style from './style.css';

export default class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange() {
        let self = this;
        return (event, date) => {
            self.props.onChange({
                value: formatIso(date)
            });
        };
    }
    render() {
        let dpStyles = {
            border: '1px solid #D6D6D6',
            height: '30px'
        };
        let textFieldStyle = {
            cursor: 'pointer',
            width: '100%',
            height: '100%'
        };
        return (
            <div className={classnames(style.datePicker)} style={this.props.wrapperStyles}>
                <div className={style.datePickerIcon} style={this.props.iconStyles} />
                <DatePickerInput
                  name={this.props.keyProp || ''}
                  style={dpStyles}
                  textFieldStyle={textFieldStyle}
                  DateTimeFormat={this.props.DateTimeFormat}
                  cancelLabel={this.props.cancelLabel}
                  okLabel={this.props.okLabel}
                  container={this.props.container}
                  value={this.props.defaultValue}
                  mode={this.props.mode}
                  onChange={this.handleChange()}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                />
            </div>
        );
    }
}

DatePicker.defaultProps = {
    firstDayOfWeek: 1,
    mode: 'landscape',
    container: 'dialog'
};
DatePicker.propTypes = {
    defaultValue: PropTypes.object, // accepts new Date() object or empty object or null
    locale: PropTypes.string,
    okLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    firstDayOfWeek: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]), // 0 (Sunday) to 6 (Saturday), default is 1
    container: PropTypes.oneOf(['dialog', 'inline']),
    mode: PropTypes.oneOf(['landscape', 'portrait']),
    masterLabel: PropTypes.string,
    labelFrom: PropTypes.string,
    DateTimeFormat: PropTypes.func,
    onChange: PropTypes.func,
    wrapperStyles: PropTypes.object,
    iconStyles: PropTypes.object,
    keyProp: PropTypes.string
};

DatePicker.contextTypes = {
    implementationStyle: PropTypes.object
};
