import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const Source = React.createClass({
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
        let { Country, region, City, cardProduct, accountProduct, account, organization, supervisor } = this.context.nomenclatures;
        let { onChangeInput, onSelectDropdown } = this;
        return (
           <div className={style.content}>
                {Country &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceCountryId'
                          label='Country'
                          data={Country}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceCountryId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {region &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceRegionId'
                          label='Region'
                          data={region}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceRegionId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {City &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceCityId'
                          label='City'
                          data={City}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceCityId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {organization &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceOrganizationId'
                          label='Organization'
                          data={organization}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceOrganizationId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {supervisor &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceSupervisorId'
                          label='Organization'
                          data={supervisor}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceSupervisorId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='sourceTag'
                      label='Tag'
                      onChange={onChangeInput}
                      value={'' + (this.props.data.sourceTag || '')}
                    />
                </div>
                {cardProduct &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceCardProductId'
                          label='Card Product'
                          data={cardProduct}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceCardProductId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {accountProduct &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceAccountProductId'
                          label='Account Product'
                          data={accountProduct}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceAccountProductId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
                {account &&
                    <div className={style.inputWrapper}>
                        <Dropdown
                          canSelectPlaceholder
                          keyProp='sourceAccountId'
                          label='Account'
                          data={account}
                          onSelect={onSelectDropdown}
                          defaultSelected={'' + (this.props.data.sourceAccountId || '')}
                          mergeStyles={{dropDownRoot: style.dropDownRoot}}
                        />
                    </div>
                }
            </div>
        );
    }
});

export default Source;
