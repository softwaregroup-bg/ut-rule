import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import plusImage from '../../assets/add_new.png';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const Channel = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired,
        fields: PropTypes.object,
        addPropertyRow: PropTypes.func.isRequired,
        properties: PropTypes.array.isRequired
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
            {name: 'Name', key: 'name'},
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
                      keyProp='name'
                      onChange={this.onChangePropertyInput(index)}
                      value={'' + (channelProperty.name || '')}
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
        let {channel, country, region, city, supervisor, organization, role, agentType} = this.context.nomenclatures;
        let { onSelectDropdown } = this;
        let fields = this.state.fields;

        return (
            <div className={style.content}>
                <div className={style.inputWrapper}>
                  <Dropdown
                    data={[
                        {
                            key: 'any',
                            name: 'Any'
                        },
                        {
                            key: 'mobile',
                            name: 'Mobile'
                        },
                        {
                            key: 'web',
                            name: 'Web'
                        },
                        {
                            key: 'system',
                            name: 'System'
                        },
                        {
                            key: 'ussd',
                            name: 'USSD'
                        }
                    ]}
                    defaultSelected={'' + (this.props.data.channelType || '')}
                    keyProp='channelType'
                    placeholder='Select'
                    onSelect={onSelectDropdown}
                    label='Channel'
                    mergeStyles={{dropDownRoot: style.dropDownRoot}}
                  />
                </div>
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
                        disabled={this.props.data.channelAgentTypeId}
                      />
                  </div>
                }
                {fields.agentType.visible && agentType &&
                  <div className={style.inputWrapper}>
                      <Dropdown
                        canSelectPlaceholder
                        data={agentType || []}
                        defaultSelected={'' + (this.props.data.channelAgentTypeId || '')}
                        keyProp='channelAgentTypeId'
                        placeholder={fields.agentType.title}
                        onSelect={onSelectDropdown}
                        label={fields.agentType.title}
                        mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        disabled={this.props.data.channelRoleId}
                      />
                  </div>
                }
            </div>
        );
    }
});

export default Channel;
