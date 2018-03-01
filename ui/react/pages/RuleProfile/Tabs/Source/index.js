import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import Input from 'ut-front-react/components/Input';
import style from '../style.css';
import * as actions from '../../actions';
const destinationProp = 'source';
const propTypes = {
    actions: PropTypes.object,
    countries: PropTypes.array,
    regions: PropTypes.array,
    cities: PropTypes.array,
    organizations: PropTypes.array,
    cardProducts: PropTypes.array,
    accountProducts: PropTypes.array,
    fieldValues: PropTypes.object
};

const defaultProps = {
    countries: [],
    regions: [],
    cities: [],
    cardProducts: [],
    organizations: []
};

class SourceTab extends Component {
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
            countries,
            regions,
            cities,
            organizations,
            cardProducts,
            accountProducts,
            fieldValues
        } = this.props;

        let changeInput = (field, value) => {
            this.props.actions.changeInput(field, destinationProp);
        };
        return (
            <div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      name='country'
                      label={'Country'}
                      value={fieldValues.countries}
                      options={countries}
                      onChange={(value) => { changeInput({key: 'countries', value}); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      name='region'
                      label={'Region'}
                      value={fieldValues.regions}
                      options={regions}
                      onChange={(value) => { changeInput({key: 'regions', value}); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <MultiSelectBubble
                      name='city'
                      label={'City'}
                      value={fieldValues.cities}
                      options={cities}
                      onChange={(value) => { changeInput({key: 'cities', value}); }}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      canSelectPlaceholder
                      keyProp={'organization'}
                      data={organizations}
                      defaultSelected={fieldValues.organization}
                      placeholder='Enter Organizaton'
                      onSelect={(field) => { changeInput(field); }}
                      label={'Organizaton'}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      canSelectPlaceholder
                      keyProp={'cardProduct'}
                      data={cardProducts}
                      defaultSelected={fieldValues.cardProduct}
                      placeholder='Enter Product'
                      onSelect={(field) => { changeInput(field); }}
                      label={'Product'}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      canSelectPlaceholder
                      keyProp={'accountProduct'}
                      data={accountProducts}
                      defaultSelected={fieldValues.accountProduct}
                      placeholder='Enter Account Product'
                      onSelect={(field) => { changeInput(field); }}
                      label={'Account Product'}
                    />
                </div>
            </div>
        );
    }

    renderInfoFields() {
        return (
            <div className={style.contentBox}>
                <div className={style.contentBoxWrapper}>
                    <TitledContentBox
                      title='Source Info'
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

SourceTab.propTypes = propTypes;
SourceTab.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    let { mode, id } = state.ruleProfileReducer.get('config').toJS();
    return {
        countries: state.ruleProfileReducer.getIn(['nomenclatures', 'country']).toJS(),
        regions: state.ruleProfileReducer.getIn(['nomenclatures', 'region']).toJS(),
        cities: state.ruleProfileReducer.getIn(['nomenclatures', 'city']).toJS(),
        organizations: state.ruleProfileReducer.getIn(['nomenclatures', 'organization']).toJS(),
        cardProducts: state.ruleProfileReducer.getIn(['nomenclatures', 'cardProduct']).toJS(),
        accountProducts: state.ruleProfileReducer.getIn(['nomenclatures', 'accountProduct']).toJS(),
        fieldValues: state.ruleProfileReducer.getIn([mode, id, destinationProp]).toJS()
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SourceTab);
