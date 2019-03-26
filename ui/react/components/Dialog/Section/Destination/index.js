import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import plusImage from '../../assets/add_new.png';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const Destination = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired,
        nomenclatures: PropTypes.object,
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
            self.context.onFieldChange('destinationProperties', index, field.key, field.value);
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
        return this.props.properties.map((destinationProperties, index) => (
            <tr key={index}>
                <td>
                    <Input
                      keyProp='name'
                      onChange={this.onChangePropertyInput(index)}
                      value={'' + (destinationProperties.name || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='value'
                      onChange={this.onChangePropertyInput(index)}
                      value={'' + (destinationProperties.value || '')}
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
        let { country, region, city, accountProduct, account,
            organization, supervisor, role, riskProfile,
            accountCategory } = this.context.nomenclatures;
        let { onSelectDropdown } = this;
        let fields = this.state.fields;

        return (
           <div className={style.content}>
                {fields.organization.visible && organization &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='destinationOrganizationId'
                          label={fields.organization.title}
                          data={organization || []}
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
                          data={role || []}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.destinationRoleId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                <div className={style.inputWrapper}>
                    <Dropdown
                    canSelectPlaceholder
                    data={riskProfile || []}
                    defaultSelected={'' + (this.props.data.destinationAccountRiskProfileId || '')}
                    keyProp='destinationAccountRiskProfileId'
                    placeholder={'Risk Profile'}
                    onSelect={onSelectDropdown}
                    label={'Risk Profile'}
                    mergeStyles={{dropDownRoot: style.dropDownRoot}}
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                    canSelectPlaceholder
                    data={accountCategory || []}
                    defaultSelected={'' + (this.props.data.destinationAccountCategoryId || '')}
                    keyProp='destinationAccountCategoryId'
                    placeholder={'Account Category'}
                    onSelect={onSelectDropdown}
                    label={'Account Category'}
                    mergeStyles={{dropDownRoot: style.dropDownRoot}}
                    />
                </div>
            </div>
        );
    }
});

export default Destination;
