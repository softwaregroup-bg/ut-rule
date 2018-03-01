import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import DatePicker from 'ut-front-react/components/DatePicker/Simple';
import Input from 'ut-front-react/components/Input';
import style from '../style.css';
import * as actions from '../../actions';
const destinationProp = 'operation';
const propTypes = {
    operations: PropTypes.array,
    fieldValues: PropTypes.object,
    actions: PropTypes.object
};

const defaultProps = {
    operations: []
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
            {name: '', key: 'rangeActions', className: style.deleteCol}
        ].map((cell, i) => (
            <th key={i} className={cell.className || ''}>{cell.name}</th>
        ));
    }

    getPropetyRowsBody() {
        const { properties } = this.props.fieldValues;
        let removeProperty = (index) => {
            this.props.actions.removeProperty(index, destinationProp);
        };
        let changeInput = (field) => {
            this.props.actions.changeInput(field, destinationProp);
        };
        return properties.map((prop, index) => {
            return (
                <tr key={`${index}`}>
                    <td>
                        <Input
                          keyProp={['properties', index, 'name'].join(',')}
                          onChange={(field) => { changeInput(field); }}
                          value={prop.name}
                        />
                    </td>
                    <td>
                        <Input
                          keyProp={['properties', index, 'value'].join(',')}
                          onChange={(field) => { changeInput(field); }}
                          value={prop.value}
                        />
                    </td>
                    <td className={style.deleteCol}>
                        <div className={style.deleteIcon} onClick={() => { removeProperty(index); }} />
                    </td>
                </tr>
            );
        });
    }

    renderPropertyTable() {
        let addProperty = () => {
            this.props.actions.addProperty(destinationProp);
        };
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
                    <div className={style.plus} />
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
        let changeInput = (field) => {
            this.props.actions.changeInput(field, destinationProp);
        };
        return (
            <div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      name='opearations'
                      label={'Operation'}
                      value={fieldValues.operations}
                      options={operations}
                      onChange={(value) => { changeInput({key: 'operations', value}); }}
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
                              onChange={({value}) => { changeInput({key: 'startDate', value}); }}
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
                              onChange={({value}) => { changeInput({key: 'endDate', value}); }}
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
    let { mode, id } = state.ruleProfileReducer.get('config').toJS();
    return {
        operations: state.ruleProfileReducer.getIn(['nomenclatures', 'operation']).toJS(),
        fieldValues: state.ruleProfileReducer.getIn([mode, id, destinationProp]).toJS()
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationTab);
