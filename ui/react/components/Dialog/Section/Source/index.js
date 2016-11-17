import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const Source = React.createClass({
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
                          keyProp='sourceCountryId'
                          label='Country'
                          data={country}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceCountryId || '')}
                        />
                    </div>
                }
                {region &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceRegionId'
                          label='Region'
                          data={region}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceRegionId || '')}
                        />
                    </div>
                }
                {city &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceCityId'
                          label='City'
                          data={city}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceCityId || '')}
                        />
                    </div>
                }
                {organization &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceOrganizationId'
                          label='Organization'
                          data={organization}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceOrganizationId || '')}
                        />
                    </div>
                }
                {supervisor &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceSupervisorId'
                          label='Organization'
                          data={supervisor}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceSupervisorId || '')}
                        />
                    </div>
                }
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='sourceTag'
                      label='Tag'
                      onChange={onChangeInput}
                      value={'' + (this.props.data.sourceTag || '')}
                    />
                </div>
                {product &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceProductId'
                          label='Product'
                          data={product}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceProductId || '')}
                        />
                    </div>
                }
                {account &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceAccountId'
                          label='Account'
                          data={account}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceAccountId || '')}
                        />
                    </div>
                }
            </div>
        );
    }
});

export default Source;
