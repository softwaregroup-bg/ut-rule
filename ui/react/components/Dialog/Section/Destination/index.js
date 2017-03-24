import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const Destination = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired,
        fields: PropTypes.object
    },
    contextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object
    },
    getInitialState() {
        return {
            fields: this.props.fields
        };
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
        let fields = this.state.fields;
        return (
           <div className={style.content}>
                {fields.country.visible && country &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationCountryId'
                          label={fields.country.title}
                          data={country}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationCountryId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.region.visible && region &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationRegionId'
                          label={fields.region.title}
                          data={region}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationRegionId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.city.visible && city &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationCityId'
                          label={fields.city.title}
                          data={city}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationCityId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.organization.visible && organization &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationOrganizationId'
                          label={fields.organization.title}
                          data={organization}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationOrganizationId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.supervisor.visible && supervisor &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationSupervisorId'
                          label={fields.supervisor.title}
                          data={supervisor}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationSupervisorId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.tag.visible &&
                    <div className={style.inputWrapper}>
                        <Input
                          keyProp='destinationTag'
                          label={fields.tag.title}
                          onChange={onChangeInput}
                          value={'' + (this.props.data.destinationTag || '')}
                        />
                    </div>
                }
                {fields.accountProduct.visible && product &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationProductId'
                          label={fields.accountProduct.title}
                          data={product}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationProductId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.account.visible && account &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationAccountId'
                          label={fields.account.title}
                          data={account}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationAccountId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
            </div>
        );
    }
});

export default Destination;
