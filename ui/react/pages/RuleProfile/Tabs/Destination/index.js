import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import { fromJS } from 'immutable';
import Property from '../../../../components/Property';
import style from '../style.css';
import * as actions from '../../actions';
const destinationProp = 'destination';
const propTypes = {
    actions: PropTypes.object,
    countries: PropTypes.array,
    regions: PropTypes.array,
    cities: PropTypes.array,
    organizations: PropTypes.array,
    accountProducts: PropTypes.array,
    fieldValues: PropTypes.object,
    errors: PropTypes.object // immutable
};

const defaultProps = {
    countries: [],
    regions: [],
    cities: [],
    organizations: []
};

class DestinationTab extends Component {
    constructor(props, context) {
        super(props, context);
        this.renderFields = this.renderFields.bind(this);
    }

    renderFields() {
        const {
            countries,
            regions,
            cities,
            organizations,
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
        let addProperty = () => {
            this.props.actions.addProperty(destinationProp);
        };
        let removeProperty = (index) => {
            this.props.actions.removeProperty(index, destinationProp);
        };
        let changeInput = (field) => {
            this.props.actions.changeInput(field, destinationProp);
        };
        return (
            <div className={style.contentBox}>
                <div className={style.contentBoxWrapper}>
                    <TitledContentBox
                      title='Destination Info'
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
                      <Property
                        addProperty={addProperty}
                        removeProperty={removeProperty}
                        changeInput={changeInput}
                        properties={(this.props.fieldValues || {}).properties || []}
                        errors={this.props.errors}
                        />
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

DestinationTab.propTypes = propTypes;
DestinationTab.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    let { mode, id } = state.ruleProfileReducer.get('config').toJS();
    return {
        countries: state.ruleProfileReducer.getIn(['nomenclatures', 'country']).toJS(),
        regions: state.ruleProfileReducer.getIn(['nomenclatures', 'region']).toJS(),
        cities: state.ruleProfileReducer.getIn(['nomenclatures', 'city']).toJS(),
        organizations: state.ruleProfileReducer.getIn(['nomenclatures', 'organization']).toJS(),
        fieldValues: state.ruleProfileReducer.getIn([mode, id, destinationProp]).toJS(),
        accountProducts: state.ruleProfileReducer.getIn(['nomenclatures', 'accountProduct']).toJS(),
        errors: state.ruleProfileReducer.getIn([mode, id, 'errors', destinationProp]) || fromJS({})
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DestinationTab);
