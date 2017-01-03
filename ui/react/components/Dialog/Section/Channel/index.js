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
        let { channel, Country, region, City, role, organization, supervisor } = this.context.nomenclatures;
        let { onChangeInput, onSelectDropdown } = this;
        return (
            <div className={style.content}>
                {channel &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={channel}
                          defaultSelected={'' + (this.props.data.channelId || '')}
                          keyProp='channelId'
                          placeholder='Channel type'
                          onSelect={onSelectDropdown}
                          label='Type'
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {Country &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={Country}
                          defaultSelected={'' + (this.props.data.channelCountryId || '')}
                          keyProp='channelCountryId'
                          placeholder='Select Country'
                          onSelect={onSelectDropdown}
                          label='Country'
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {region &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={region}
                          defaultSelected={'' + (this.props.data.channelRegionId || '')}
                          keyProp='channelRegionId'
                          placeholder='Select Region'
                          onSelect={onSelectDropdown}
                          label='Region'
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {City &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={City}
                          defaultSelected={'' + (this.props.data.channelCityId || '')}
                          keyProp='channelCityId'
                          placeholder='Select City'
                          onSelect={onSelectDropdown}
                          label='City'
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {organization &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={organization}
                          defaultSelected={'' + (this.props.data.channelOrganizationId || '')}
                          keyProp='channelOrganizationId'
                          placeholder='Organization'
                          onSelect={onSelectDropdown}
                          label='Organization'
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {supervisor &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          data={supervisor}
                          defaultSelected={'' + (this.props.data.channelSupervisorId || '')}
                          keyProp='channelSupervisorId'
                          placeholder='Supervisor'
                          onSelect={onSelectDropdown}
                          label='Supervisor'
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='channelTag'
                      label='Tag'
                      onChange={onChangeInput}
                      value={'' + (this.props.data.channelTag || '')}
                    />
                </div>
                {role &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='channelRoleId'
                          label='Role'
                          data={role}
                          placeholder='Channel role'
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
