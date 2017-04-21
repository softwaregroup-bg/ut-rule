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
        let { country, region, city, cardProduct, accountProduct, account, organization, supervisor, role } = this.context.nomenclatures;
        let { onChangeInput, onSelectDropdown } = this;
        let fields = this.state.fields;

        return (
           <div className={style.content}>
                {fields.country.visible && country &&
                    <div className={style.inputWrapper}>
                        <MultiSelectBubble
                          keyProp='sourceCountryIds'
                          name='sourceCountryIds'
                          label={fields.country.title}
                          value={this.props.data.sourceCountryIds}
                          options={country}
                          onChange={(val) => { this.onSelectDropdown({key: 'sourceCountryIds', value: val}); }}
                        />
                    </div>
                }
                {fields.region.visible && region &&
                    <div className={style.inputWrapper}>
                        <MultiSelectBubble
                          keyProp='sourceRegionIds'
                          name='sourceRegionIds'
                          label={fields.region.title}
                          value={this.props.data.sourceRegionIds}
                          options={region}
                          onChange={(val) => { this.onSelectDropdown({key: 'sourceRegionIds', value: val}); }}
                        />
                    </div>
                }
                {fields.city.visible && city &&
                    <div className={style.inputWrapper}>
                        <MultiSelectBubble
                          keyProp='sourceCityIds'
                          name='sourceCityIds'
                          label={fields.city.title}
                          value={this.props.data.sourceCityIds}
                          options={city}
                          onChange={(val) => { this.onSelectDropdown({key: 'sourceCityIds', value: val}) ;}}
                        />
                    </div>
                }
                {fields.role.visible && role &&
                  <div className={style.inputWrapper}>
                      <Dropdown
                        canSelectPlaceholder
                        data={role}
                        defaultSelected={'' + (this.props.data.sourceRoleId || '')}
                        keyProp='sourceRoleId'
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
                          keyProp='sourceOrganizationId'
                          label={fields.organization.title}
                          data={organization}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceOrganizationId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.supervisor.visible && supervisor &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceSupervisorId'
                          label={fields.supervisor.title}
                          data={supervisor}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceSupervisorId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.cardProduct.visible && cardProduct &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceCardProductId'
                          label={fields.cardProduct.title}
                          data={cardProduct}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceCardProductId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.accountProduct.visible && accountProduct &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceAccountProductId'
                          label={fields.accountProduct.title}
                          data={accountProduct}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceAccountProductId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {fields.account.visible && account &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceAccountId'
                          label={fields.account.title}
                          data={account}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceAccountId || '')}
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

export default Source;
