import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import MultiSelectBubble from 'ut-front-react/components/MultiSelectBubble';
import plusImage from '../../assets/add_new.png';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const Source = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired,
        fields: PropTypes.object,
        nomenclatures: PropTypes.object,
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
            self.context.onFieldChange('sourceProperties', index, field.key, field.value);
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
        return this.props.properties.map((sourceProperty, index) => (
            <tr key={index}>
                <td>
                    <Input
                      keyProp='name'
                      onChange={this.onChangePropertyInput(index)}
                      value={'' + (sourceProperty.name || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='value'
                      onChange={this.onChangePropertyInput(index)}
                      value={'' + (sourceProperty.value || '')}
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
        let { country, region, city, cardProduct, accountProduct,
            account, organization, supervisor, role, riskProfile, highRiskProfile,
            accountCategory } = this.context.nomenclatures;
        let { onSelectDropdown } = this;
        let fields = this.state.fields;

        return (
           <div className={style.content}>
                {fields.organization.visible && organization &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceOrganizationId'
                          label={fields.organization.title}
                          data={organization || []}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceOrganizationId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.role.visible && role &&
                  <div className={style.inputWrapper}>
                      <Dropdown
                        canSelectPlaceholder
                        data={role || []}
                        defaultSelected={'' + (this.props.data.sourceRoleId || '')}
                        keyProp='sourceRoleId'
                        placeholder={fields.role.title}
                        onSelect={onSelectDropdown}
                        label={fields.role.title}
                        mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                  </div>
                }
                <div className={style.inputWrapper}>
                    <Dropdown
                    canSelectPlaceholder
                    data={(riskProfile || []).concat(highRiskProfile || [])}
                    defaultSelected={'' + (this.props.data.sourceAccountRiskProfileId || '')}
                    keyProp='sourceAccountRiskProfileId'
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
                    defaultSelected={'' + (this.props.data.sourceAccountCategoryId || '')}
                    keyProp='sourceAccountCategoryId'
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

export default Source;
