import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const Source = React.createClass({
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
                      keyProp='sourceCountryId'
                      label='Country'
                      data={country}
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.sourceCountryId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      keyProp='sourceRegionId'
                      label='Region'
                      data={region}
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.sourceRegionId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      keyProp='sourceCityId'
                      label='City'
                      data={city}
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.sourceCityId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='sourceOrganizationId'
                      label='Organization'
                      onChange={onChangeInput}
                      value={this.props.data.sourceOrganizationId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='sourceSupervisorId'
                      label='Supervisor'
                      onChange={onChangeInput}
                      value={this.props.data.sourceSupervisorId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='sourceTag'
                      label='Tag'
                      onChange={onChangeInput}
                      value={this.props.data.sourceTag || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      keyProp='sourceProductId'
                      label='Product'
                      data={product}
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.sourceProductId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      keyProp='sourceAccountId'
                      label='Account'
                      data={account}
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.sourceAccountId || ''}
                    />
                </div>
            </div>
        );
    }
});

export default Source;
