import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';

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
        let { country, region, city, accountProduct, account, organization, supervisor, role } = this.context.nomenclatures;
        let { onChangeInput, onSelectDropdown } = this;
        let fields = this.state.fields;

        return (
           <div className={style.content}>
                {fields.country.visible && country &&
                    <div className={style.inputWrapper}>
                        <MultiSelectBubble
                          keyProp='destinationCountryIds'
                          name='destinationCountryIds'
                          label={fields.country.title}
                          value={this.props.data.destinationCountryIds}
                          options={country}
                          onChange={(val) => {this.onSelectDropdown({key: 'destinationCountryIds', value: val})}}
                        />
                    </div>
                }
                {fields.region.visible && region &&
                    <div className={style.inputWrapper}>
                        <MultiSelectBubble
                          keyProp='destinationRegionIds'
                          name='destinationRegionIds'
                          label={fields.region.title}
                          value={this.props.data.destinationRegionIds}
                          options={region}
                          onChange={(val) => {this.onSelectDropdown({key: 'destinationRegionIds', value: val})}}
                        />
                    </div>
                }
                {fields.city.visible && city &&
                    <div className={style.inputWrapper}>
                        <MultiSelectBubble
                          keyProp='destinationCityIds'
                          name='destinationCityIds'
                          label={fields.city.title}
                          value={this.props.data.destinationCityIds}
                          options={city}
                          onChange={(val) => {this.onSelectDropdown({key: 'destinationCityIds', value: val})}}
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
                {fields.role.visible && role &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationRoleId'
                          label={fields.role.title}
                          data={role}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationRoleId || '')}
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
                {fields.accountProduct.visible && accountProduct &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationAccountProductId'
                          label={fields.accountProduct.title}
                          data={accountProduct}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationAccountProductId || '')}
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
            </div>
        );
    }
});

export default Destination;
