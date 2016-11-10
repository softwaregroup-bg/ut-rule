import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const Destination = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object
    },
    onSelectDropdown(field) {
        this.context.onFieldChange('condition', 0, field.key, field.value);
    },
    onChangeInput(field) {
        this.context.onFieldChange('condition', 0, field.key, field.value);
    },
    render() {
        let { country, region, city, product, account, organization, supervisor } = this.context.nomenclatures;
        let { onChangeInput, onSelectDropdown } = this;
        return (
           <div className={style.content}>
                {country &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationCountryId'
                          label='Country'
                          data={country}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationCountryId || '')}
                        />
                    </div>
                }
                {region &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationRegionId'
                          label='Region'
                          data={region}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationRegionId || '')}
                        />
                    </div>
                }
                {city &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationCityId'
                          label='City'
                          data={city}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationCityId || '')}
                        />
                    </div>
                }
                {organization &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationOrganizationId'
                          label='Organization'
                          data={organization}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationOrganizationId || '')}
                        />
                    </div>
                }
                {supervisor &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationSupervisorId'
                          label='Supervisor'
                          data={supervisor}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationSupervisorId || '')}
                        />
                    </div>
                }
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='destinationTag'
                      label='Tag'
                      onChange={onChangeInput}
                      value={'' + (this.props.data.destinationTag || '')}
                    />
                </div>
                {product &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationProductId'
                          label='Product'
                          data={product}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationProductId || '')}
                        />
                    </div>
                }
                {account &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationAccountId'
                          label='Account'
                          data={account}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationAccountId || '')}
                        />
                    </div>
                }
            </div>
        );
    }
});

export default Destination;
