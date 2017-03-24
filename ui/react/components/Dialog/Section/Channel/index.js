import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const Channel = React.createClass({
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
        let { channel, country, region, city, role, organization, supervisor } = this.context.nomenclatures;
        let { onChangeInput, onSelectDropdown } = this;
        let fields = this.state.fields;
        return (
            <div className={style.content}>
                {fields.channel.visible && channel &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={channel}
                          defaultSelected={'' + (this.props.data.channelId || '')}
                          keyProp='channelId'
                          placeholder={fields.channel.title}
                          onSelect={onSelectDropdown}
                          label={fields.channel.title}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.country.visible && country &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={country}
                          defaultSelected={'' + (this.props.data.channelCountryId || '')}
                          keyProp='channelCountryId'
                          placeholder={fields.country.title}
                          onSelect={onSelectDropdown}
                          label={fields.country.title}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.region.visible && region &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={region}
                          defaultSelected={'' + (this.props.data.channelRegionId || '')}
                          keyProp='channelRegionId'
                          placeholder={fields.region.title}
                          onSelect={onSelectDropdown}
                          label={fields.region.title}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.city.visible && city &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={city}
                          defaultSelected={'' + (this.props.data.channelCityId || '')}
                          keyProp='channelCityId'
                          placeholder={fields.city.title}
                          onSelect={onSelectDropdown}
                          label={fields.city.title}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.organization.visible && organization &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={organization}
                          defaultSelected={'' + (this.props.data.channelOrganizationId || '')}
                          keyProp='channelOrganizationId'
                          placeholder={fields.organization.title}
                          onSelect={onSelectDropdown}
                          label={fields.organization.title}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.supervisor.visible && supervisor &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={supervisor}
                          defaultSelected={'' + (this.props.data.channelSupervisorId || '')}
                          keyProp='channelSupervisorId'
                          placeholder={fields.supervisor.title}
                          onSelect={onSelectDropdown}
                          label={fields.supervisor.title}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.tag.visible &&
                    <div className={style.inputWrapper}>
                        <Input
                          keyProp='channelTag'
                          label={fields.tag.title}
                          onChange={onChangeInput}
                          value={'' + (this.props.data.channelTag || '')}
                        />
                    </div>
                }
                {fields.role.visible && role &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='channelRoleId'
                          label={fields.role.title}
                          data={role}
                          placeholder={fields.role.title}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.channelRoleId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
            </div>
        );
    }
});

export default Channel;
