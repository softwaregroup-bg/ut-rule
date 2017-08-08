import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { removeTab } from 'ut-front-react/containers/TabMenu/actions';

import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import DatePicker from 'ut-front-react/components/DatePicker/Simple';
import Input from 'ut-front-react/components/Input';
import style from './style.css';

import plusImage from './assets/add_new.png';
import deleteImage from './assets/delete.png';

import * as actions from './actions';

const propTypes = {

};

const defaultProps = {
    operations: [],
    organizations: []
};

class OperationTab extends Component {
    constructor(props, context) {
        super(props, context);
        this.renderFields = this.renderFields.bind(this);
        this.getPropetyRowsBody = this.getPropetyRowsBody.bind(this);
        this.renderPropertyTable = this.renderPropertyTable.bind(this);
    }

    getPropertyHeaderCells() {
        return [
            {name: 'Name', key: 'name'},
            {name: 'Value', key: 'value'},
            {name: '', key: 'rangeActions', className: style.deleteButton}
        ].map((cell, i) => (
            <th key={i} className={cell.className || ''}>{cell.name}</th>
        ));
    }

    getPropetyRowsBody() {
        const { properties } = this.props.fieldValues;
        const { removeProperty, setPropertyField } = this.props.actions;
        return properties.map((prop, index) => {
            return (
                <tr key={`${index}`}>
                    <td>
                        <Input
                          keyProp='name'
                          onChange={({key, value}) => { setPropertyField(index, key, value); }}
                          value={prop.name}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp='value'
                          onChange={({key, value}) => { setPropertyField(index, key, value); }}
                          value={prop.value}
                        />
                    </td>
                    <td>
                        <img
                          src={deleteImage}
                          className={style.deleteButton}
                          onClick={() => { removeProperty(index); }}
                        />
                    </td>
                </tr>
            );
        });
    }

    renderPropertyTable() {
        const { addProperty } = this.props.actions;
        return (
            <div className={style.propertyTable}>
                <table className={style.dataGridTable}>
                    <thead>
                        <tr>
                            {this.getPropertyHeaderCells()}
                        </tr>
                    </thead>
                    <tbody >
                        {this.getPropetyRowsBody()}
                    </tbody>
                </table>
                <span className={style.link} onClick={addProperty}>
                    <img src={plusImage} className={style.plus} />
                    Add another property
                </span>
            </div>
        );
    }

    renderFields() {
        const {
            operations,
            fieldValues
        } = this.props;

        const {
            changeMultiSelectField,
            changeDropdownField
        } = this.props.actions;

        return (
            <div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      name='opearations'
                      label={'Operation'}
                      value={fieldValues.operations}
                      options={operations}
                      onChange={(value) => { changeMultiSelectField('operations', value); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <div className={style.outerWrap}>
                        <div className={style.lableWrap}>Start Date</div>
                        <div className={style.inputWrap}>
                            <DatePicker
                              wrapperStyles={{backgroundColor: 'white'}}
                              keyProp='startDate'
                              mode='landscape'
                              onChange={({value}) => { changeDropdownField('startDate', value); }}
                              defaultValue={fieldValues.startDate}
                            />
                        </div>
                    </div>
                </div>
                <div className={style.inputWrapper}>
                    <div className={style.outerWrap}>
                        <div className={style.lableWrap}>End Date</div>
                        <div className={style.inputWrap}>
                            <DatePicker
                              wrapperStyles={{backgroundColor: 'white'}}
                              keyProp='endDate'
                              mode='landscape'
                              onChange={({value}) => { changeDropdownField('endDate', value); }}
                              defaultValue={fieldValues.endDate}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderInfoFields() {
        return (
            <div className={style.contentBox}>
                <div className={style.contentBoxWrapper}>
                    <TitledContentBox
                      title='Operation Info'
                      wrapperClassName
                    >
                        {this.renderFields()}
                    </TitledContentBox>
                </div>
                <div className={style.contentBoxWrapper}>
                    <TitledContentBox
                      title='Properties'
                      wrapperClassName
                    >
                        {this.renderPropertyTable()}
                    </TitledContentBox>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderInfoFields()}
            </div>
        );
    }
}

OperationTab.propTypes = propTypes;
OperationTab.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    return {
        operations: state.ruleTabReducer.getIn(['nomenclatures', 'operation']),
        fieldValues: state.ruleOperationTabReducer.get('fields').toJS()
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationTab);
