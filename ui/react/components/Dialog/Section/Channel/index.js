import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const Channel = React.createClass({
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
        let { channel, country, region, city, role, organization, supervisor } = this.context.nomenclatures;
        let { onChangeInput, onSelectDropdown } = this;
        return (
            <div className={style.content}>
                <div className={style.inputWrapper}>
                    <Dropdown
                      canSelectPlaceholder
                      data={channel}
                      defaultSelected={'' + (this.props.data.channelId || '')}
                      keyProp='channelId'
                      placeholder='Channel type'
                      onSelect={onSelectDropdown}
                      label='Type'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      canSelectPlaceholder
                      data={country}
                      defaultSelected={'' + (this.props.data.channelCountryId || '')}
                      keyProp='channelCountryId'
                      placeholder='Select Country'
                      onSelect={onSelectDropdown}
                      label='Country'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      canSelectPlaceholder
                      data={region}
                      defaultSelected={'' + (this.props.data.channelRegionId || '')}
                      keyProp='channelRegionId'
                      placeholder='Select Region'
                      onSelect={onSelectDropdown}
                      label='Region'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      canSelectPlaceholder
                      data={city}
                      defaultSelected={'' + (this.props.data.channelCityId || '')}
                      keyProp='channelCityId'
                      placeholder='Select City'
                      onSelect={onSelectDropdown}
                      label='City'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      canSelectPlaceholder
                      data={organization}
                      defaultSelected={'' + (this.props.data.channelOrganizationId || '')}
                      keyProp='channelOrganizationId'
                      placeholder='Organization'
                      onSelect={onSelectDropdown}
                      label='Organization'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      canSelectPlaceholder
                      data={supervisor}
                      defaultSelected={'' + (this.props.data.channelSupervisorId || '')}
                      keyProp='channelSupervisorId'
                      placeholder='Supervisor'
                      onSelect={onSelectDropdown}
                      label='Supervisor'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='channelTag'
                      label='Tag'
                      onChange={onChangeInput}
                      value={'' + (this.props.data.channelTag || '')}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      canSelectPlaceholder
                      keyProp='channelRoleId'
                      label='Role'
                      data={role}
                      placeholder='Channel role'
                      onSelect={onSelectDropdown}
                      defaultSelected={'' + (this.props.data.channelRoleId || '')}
                    />
                </div>
            </div>
        );
    }
});

export default Channel;
