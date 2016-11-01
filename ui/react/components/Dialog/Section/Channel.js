import React, { PropTypes } from 'react';
import style from '../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const SectionChannel = React.createClass({
    propTypes: {
        errors: PropTypes.object,
        channels: PropTypes.array,
        countries: PropTypes.array,
        regions: PropTypes.array,
        cities: PropTypes.array,
        roles: PropTypes.array
    },
    onSelectDropdown() {},
    onChangeInput() {},
    render() {
        let { channels, countries, regions, cities, roles, errors } = this.props;
        let { onChangeInput, onSelectDropdown } = this;
        return (
            <div className={style.content}>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={channels}
                      keyProp='ruleTypeId'
                      placeholder='Select Rule Type'
                      onSelect={onSelectDropdown}
                      isValid={!errors.ruleType}
                      label='Type'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={countries}
                      keyProp='countryId'
                      placeholder='Select Country'
                      onSelect={onSelectDropdown}
                      isValid={!errors.country}
                      label='Country'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={regions}
                      keyProp='regionId'
                      placeholder='Select Region'
                      onSelect={onSelectDropdown}
                      isValid={!errors.region}
                      label='Region'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={cities}
                      keyProp='cityId'
                      placeholder='Select City'
                      onSelect={onSelectDropdown}
                      isValid={!errors.city}
                      label='City'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='organization'
                      onChange={onChangeInput}
                      label='Name'
                      placeholder='Please enter Organization'
                      isValid={!errors.organization}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='supervisor'
                      onChange={onChangeInput}
                      label='Supervisor'
                      placeholder='Please enter a supervisor'
                      isValid={!errors.supervisor}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='channelTag'
                      onChange={onChangeInput}
                      label='Tag'
                      placeholder='Please enter channel tag'
                      isValid={!errors.channelTag}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={roles}
                      keyProp='regionId'
                      placeholder='Select role'
                      onSelect={onSelectDropdown}
                      isValid={!errors.role}
                      label='Role'
                      errorMessage={errors.role}
                    />
                </div>
            </div>
        );
    }
});

export default SectionChannel;
