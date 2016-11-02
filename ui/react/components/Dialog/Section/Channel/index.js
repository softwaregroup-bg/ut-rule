import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const Channel = React.createClass({
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
        let { channel, country, region, city, role } = this.props.nomenclatures;
        let { onChangeInput, onSelectDropdown } = this;
        return (
            <div className={style.content}>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={channel}
                      defaultSelected={this.props.data.channelId || ''}
                      keyProp='channelId'
                      placeholder='Channel type'
                      onSelect={onSelectDropdown}
                      label='Type'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={country}
                      defaultSelected={this.props.data.channelCountryId || ''}
                      keyProp='channelCountryId'
                      placeholder='Select Country'
                      onSelect={onSelectDropdown}
                      label='Country'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={region}
                      defaultSelected={this.props.data.channelRegionId || ''}
                      keyProp='channelRegionId'
                      placeholder='Select Region'
                      onSelect={onSelectDropdown}
                      label='Region'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={city}
                      defaultSelected={this.props.data.channelCityId || ''}
                      keyProp='channelCityId'
                      placeholder='Select City'
                      onSelect={onSelectDropdown}
                      label='City'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='channelOrganizationId'
                      label='Organization'
                      value={this.props.data.channelOrganizationId || ''}
                      onChange={onChangeInput}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='channelSupervisorId'
                      label='Supervisor'
                      onChange={onChangeInput}
                      value={this.props.data.channelSupervisorId || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='channelTag'
                      label='Tag'
                      onChange={onChangeInput}
                      value={this.props.data.channelTag || ''}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      keyProp='channelRoleId'
                      label='Role'
                      data={role}
                      placeholder='Channel role'
                      onSelect={onSelectDropdown}
                      defaultSelected={this.props.data.channelRoleId || ''}
                    />
                </div>
            </div>
        );
    }
});

export default Channel;
