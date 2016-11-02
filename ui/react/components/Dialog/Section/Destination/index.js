import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const Destination = React.createClass({
    propTypes: {
        nomenclatures: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func
    },
    onSelectDropdown(field) {
        this.context.onFieldChange('condition', 0, field.key, field.value);
    },
    onChangeInput(field) {
        this.context.onFieldChange('condition', 0, field.key, field.value);
    },
    render() {
        let { country, region, city, product, account } = this.props.nomenclatures;
        let { onChangeInput, onSelectDropdown } = this;
        return (
           <div className={style.content}>
                <div className={style.inputWrapper}>
                    <Dropdown
                      keyProp='destinationCountryId'
                      label='Country'
                      data={country}
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.destinationCountryId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      keyProp='destinationRegionId'
                      label='Region'
                      data={region}
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.destinationRegionId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      keyProp='destinationCityId'
                      label='City'
                      data={city}
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.destinationCityId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='destinationOrganizationId'
                      label='Organization'
                      onChange={onChangeInput}
                      value={this.props.data.destinationOrganizationId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='destinationSupervisorId'
                      label='Supervisor'
                      onChange={onChangeInput}
                      value={this.props.data.destinationSupervisorId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='destinationTag'
                      label='Tag'
                      onChange={onChangeInput}
                      value={this.props.data.destinationTag || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      keyProp='destinationProductId'
                      label='Product'
                      data={product}
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.destinationProductId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      keyProp='destinationAccountId'
                      label='Account'
                      data={account}
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.destinationAccountId || ''}
                    />
                </div>
            </div>
        );
    }
});

export default Destination;
