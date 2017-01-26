import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import plusImage from '../../assets/add_new.png';
import Accordion from 'ut-front-react/components/Accordion';
import MultiSelect from 'ut-front-react/components/Input/MultiSelectDropdown';
import Range from './Range';
import Assignment from './Assignment';

const Splits = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        addSplitRow: PropTypes.func.isRequired,
        deleteSplitRow: PropTypes.func.isRequired,
        addSplitRangeRow: PropTypes.func.isRequired,
        deleteSplitRangeRow: PropTypes.func.isRequired,
        addSplitAssignmentRow: PropTypes.func.isRequired,
        deleteSplitAssignmentRow: PropTypes.func.isRequired,
        config: PropTypes.object
    },
    contextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object
    },
    getInitialState() {
        return {
            config: this.props.config
        };
    },
    onSelectDropdown(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('split', index, field.key, field.value);
        };
    },
    onChangeInput(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('split', index, field.key, field.value);
        };
    },
    onDeleteRow(index) {
        let self = this;
        return () => {
            self.props.deleteSplitRow(index);
        };
    },
    createSplitRows() {
        var self = this;
        return this.props.data.map((split, index) => (
            <div key={index} style={{marginBottom: '20px'}}>
                <div className={style.border}>
                    <div className={style.splitInput}>
                        <Input
                          label='Name'
                          keyProp='splitName.name'
                          onChange={this.onChangeInput(index)}
                          value={(split.splitName.name || '')}
                        />
                    </div>
                    <div className={style.splitInput}>
                        <MultiSelect
                          placeholder='Select Tags'
                          defaultSelected={split.splitName.tag}
                          onSelect={self.onChangeInput(index)}
                          data={[
                            {key: 'acquirer', name: 'Acquirer'},
                            {key: 'issuer', name: 'Issuer'},
                            {key: 'commission', name: 'Commission'}
                          ]}
                          label='Tag'
                          keyProp='splitName.tag'
                        />
                    </div>
                </div>
                <Accordion title='Range' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                    <div className={style.content}>
                        <Range
                          splitIndex={index}
                          data={split.splitRange}
                          addSplitRangeRow={self.props.addSplitRangeRow}
                          deleteSplitRangeRow={self.props.deleteSplitRangeRow}
                        />
                    </div>
                </Accordion>
                <Accordion title='Assignment' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                    <div className={style.content}>
                        <Assignment
                          splitIndex={index}
                          data={split.splitAssignment}
                          addSplitAssignmentRow={self.props.addSplitAssignmentRow}
                          deleteSplitAssignmentRow={self.props.deleteSplitAssignmentRow}
                          fields={this.state.config.assignmentFields}
                        />
                    </div>
                </Accordion>
                <button className={style.statusActionButton} onClick={self.onDeleteRow(index)}>
                    Delete this Split
                </button>
            </div>
        ));
    },
    render() {
        return (
            <div>
                {this.createSplitRows()}
                <span className={style.link} onClick={this.props.addSplitRow}>
                    <img src={plusImage} className={style.plus} />
                    Add another split
                </span>
            </div>
        );
    }
});

export default Splits;
