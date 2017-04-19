import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import MultiSelectBubbleCustom from 'ut-front-react/components/MultiSelectBubbleCustom';
import plusImage from '../../assets/add_new.png';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const Channel = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired,
        fields: PropTypes.object,
        addPropertyRow: PropTypes.func.isRequired,
        properties: PropTypes.array.isRequired,
        deletePropetyRow: PropTypes.func.isRequired
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
    onChangePropertyInput(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('channelProperties', index, field.key, field.value);
        };
    },
    onDeletePropertyRow(index) {
        let self = this;
        return () => {
            self.props.deletePropetyRow(index);
        };
    },
    createPropertyHeaderCells() {
        return [
            {name: 'Key', key: 'key'},
            {name: 'Value', key: 'value'},
            {name: '', key: 'rangeActions', className: style.deleteButton}
        ].map((cell, i) => (
            <th key={i} className={cell.className || ''}>{cell.name}</th>
        ));
    },
    createPropetyRows() {
        return this.props.properties.map((channelProperty, index) => (
            <tr key={index}>
                <td>
                    <Input
                      keyProp='key'
                      onChange={this.onChangePropertyInput(index)}
                      value={'' + (channelProperty.key || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='value'
                      onChange={this.onChangePropertyInput(index)}
                      value={'' + (channelProperty.value || '')}
                    />
                </td>
                 <td>
                    <IconButton onClick={this.onDeletePropertyRow(index)}>
                        <ActionDelete />
                    </IconButton>
                </td>
            </tr>
        ));
    },
    render() {
        let {channel, country, region, city, supervisor, organization, role} = this.context.nomenclatures;
        debugger;
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
                      <MultiSelectBubble
                        keyProp='channelCountryIds'
                        name='channelCountryIds'
                        label={fields.country.title}
                        value={this.props.data.channelCountryIds}
                        options={country}
                        onChange={(val) => { this.onSelectDropdown({key: 'channelCountryIds', value: val}); }}
                      />
                  </div>
                }
                {fields.region.visible && region &&
                    <div className={style.inputWrapper}>
                        <MultiSelectBubble
                          keyProp='channelRegionIds'
                          name='channelRegionIds'
                          label={fields.region.title}
                          value={this.props.data.channelRegionIds}
                          options={region}
                          onChange={(val) => { this.onSelectDropdown({key: 'channelRegionIds', value: val}); }}
                        />
                    </div>
                }
                {fields.city.visible && city &&
                    <div className={style.inputWrapper}>
                        <MultiSelectBubble
                          keyProp='channelCityIds'
                          name='channelCityIds'
                          label={fields.city.title}
                          value={this.props.data.channelCityIds}
                          options={city}
                          onChange={(val) => { this.onSelectDropdown({key: 'channelCityIds', value: val}); }}
                        />
                    </div>
                }
                {fields.role.visible && role &&
                  <div className={style.inputWrapper}>
                      <Dropdown
                        canSelectPlaceholder
                        data={role || []}
                        defaultSelected={'' + (this.props.data.channelRoleId || '')}
                        keyProp='channelRoleId'
                        placeholder={fields.role.title}
                        onSelect={onSelectDropdown}
                        label={fields.role.title}
                        mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                  </div>
                }
                {fields.organization.visible && organization &&
                  <div className={style.inputWrapper}>
                      <Dropdown
                        canSelectPlaceholder
                        data={organization || []}
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
                {fields.properties.visible &&
                  <div className={style.propertyTable}>
                    <table className={style.dataGridTable}>
                        <thead>
                            <tr>
                                <th colSpan={3}>Properties</th>
                            </tr>
                            <tr>
                                {this.createPropertyHeaderCells()}
                            </tr>
                        </thead>
                        <tbody >
                            {this.createPropetyRows()}
                        </tbody>
                    </table>
                    <span className={style.link} onClick={this.props.addPropertyRow}>
                        <img src={plusImage} className={style.plus} />
                        Add another property
                    </span>
                </div>
              }
            </div>
        );
    }
});

export default Channel;
