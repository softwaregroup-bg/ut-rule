import React, { PropTypes } from 'react';
import style from '../style.css';
import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

const SectionSourceDestination = React.createClass({
    propTypes: {
        countries: PropTypes.array,
        regions: PropTypes.array,
        cities: PropTypes.array
    },
    onSelectDropdown() {},
    onChangeInput() {},
    render() {
        let { countries, regions, cities } = this.props;
        let { onChangeInput, onSelectDropdown } = this;
        return (
           <div className={style.content}>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={countries}
                      keyProp='sourceDestinationCountry'
                      placeholder='Country'
                      onSelect={onSelectDropdown}
                      label='Country'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={regions}
                      keyProp='sourceDestinationRegion'
                      placeholder='Region'
                      onSelect={onSelectDropdown}
                      label='Region'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={cities}
                      keyProp='sourceDestinationCity'
                      placeholder='City'
                      onSelect={onSelectDropdown}
                      label='City'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='sourceDestinationOrganization'
                      onChange={onChangeInput}
                      label='Organization'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='sourceDestinationSupervisor'
                      onChange={onChangeInput}
                      label='Supervisor'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Input
                      keyProp='sourceDestinationTag'
                      onChange={onChangeInput}
                      label='Tag'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={regions}
                      keyProp='sourceDestinationProduct'
                      onSelect={onSelectDropdown}
                      label='Product'
                    />
                </div>
                <div className={style.inputWrapper}>
                    <Dropdown
                      data={regions}
                      keyProp='sourceDestinationAccount'
                      onSelect={onSelectDropdown}
                      label='Account'
                    />
                </div>
            </div>
        );
    }
});

export default SectionSourceDestination;
