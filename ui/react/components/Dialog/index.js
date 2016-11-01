import Dialog from 'material-ui/Dialog';
import React, { PropTypes } from 'react';
import Accordion from 'ut-front-react/components/Accordion';
// import { validationTypes, textValidations, arrayValidations, dropdownValidations } from 'ut-front-react/validator/constants.js';
import style from './style.css';
import SectionFee from './Section/Fee';
import SectionLimit from './Section/Limit';
import SectionChannel from './Section/Channel';
import SectionOperation from './Section/Operation';
import SectionSourceDestination from './Section/SourceDestination';

const convertToDropdownArray = (object) => {
    return Object.keys(object).map((key) => {
        return {
            key,
            name: object[key]
        };
    });
};

// var validations = {
//     ruleTypeId: [
//         { type: textValidations.isRequired, errorMessage: 'Rule Type is required' }
//     ],
//     organization: [
//         { type: textValidations.length, minVal: 3, maxVal: 5, errorMessage: 'organization should be between 3 and 5 symbols long' }
//     ]
// };

export default React.createClass({
    propTypes: {
        open: PropTypes.bool,
        data: PropTypes.object,
        nomenclatures: PropTypes.object,
        onSave: PropTypes.func,
        onClose: PropTypes.func
    },
    getInitialState() {
        return {
            errors: {}
        };
    },
    onSelectDropdown(selected) {

    },
    onChangeInput(input) {

    },
    render() {
        let { onSelectDropdown, onChangeInput } = this;
        let { nomenclatures } = this.props;
        let { errors } = this.state;
        return (
            <Dialog
              title={this.props.data ? 'Edit Rule' : 'Add Rule'}
              open={this.props.open}
              autoScrollBodyContent
              contentStyle={style}
              actions={[
                  <button onClick={this.props.onSave} style={{ marginRight: '10px' }}>Save</button>,
                  <button onClick={this.props.onClose}>Cancel</button>
              ]}
              >
                <div>
                    <div className={style.topSection}>
                        Status
                    </div>
                    <div className={style.wrapper}>
                        <Accordion title='Channel' fullWidth>
                            <SectionChannel
                              errors={errors}
                              channels={convertToDropdownArray(nomenclatures.channel)}
                              countries={convertToDropdownArray(nomenclatures.country)}
                              regions={convertToDropdownArray(nomenclatures.region)}
                              cities={convertToDropdownArray(nomenclatures.city)}
                              roles={convertToDropdownArray(nomenclatures.region)}
                              onChangeInput={onChangeInput}
                              onSelectDropdown={onSelectDropdown}
                            />
                        </Accordion>
                        <Accordion title='Operation' fullWidth>
                            <SectionOperation
                              regions={convertToDropdownArray(nomenclatures.region)}
                            />
                        </Accordion>
                        <Accordion title='Source - Destination' fullWidth>
                            <SectionSourceDestination
                              countries={convertToDropdownArray(nomenclatures.country)}
                              regions={convertToDropdownArray(nomenclatures.region)}
                              cities={convertToDropdownArray(nomenclatures.city)}
                            />
                        </Accordion>
                        <Accordion title='Fee' fullWidth>
                            <div className={style.content}>
                                <SectionFee
                                  currencies={convertToDropdownArray(nomenclatures.country)}
                                />
                            </div>
                        </Accordion>
                        <Accordion title='Limit' fullWidth>
                            <div className={style.content}>
                                <SectionLimit
                                  currencies={convertToDropdownArray(nomenclatures.country)}
                                />
                            </div>
                        </Accordion>
                        <Accordion title='Summary' fullWidth>
                            <div className={style.content}>
                                TODO Summary
                            </div>
                        </Accordion>
                    </div>
                </div>
            </Dialog>
        );
    }
});
