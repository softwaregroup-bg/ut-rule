import React, { PropTypes } from 'react';
import style from '../../style.css';
import Input from 'ut-front-react/components/Input';
import plusImage from '../../assets/add_new.png';
import Accordion from 'ut-front-react/components/Accordion';
import MultiSelect from 'ut-front-react/components/Input/MultiSelectDropdown';
import Cumulative from './Cumulative';
import Assignment from './Assignment';

const displaySplitTags = false;

const Splits = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        addSplitRow: PropTypes.func.isRequired,
        deleteSplitRow: PropTypes.func.isRequired,
        addSplitCumulativeRow: PropTypes.func.isRequired,
        deleteSplitCumulativeRow: PropTypes.func.isRequired,
        addSplitCumulativeRangeRow: PropTypes.func.isRequired,
        deleteSplitCumulativeRangeRow: PropTypes.func.isRequired,
        addSplitAssignmentRow: PropTypes.func.isRequired,
        deleteSplitAssignmentRow: PropTypes.func.isRequired,
        channelData: PropTypes.object,
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
    getTagData() {
        return [
            {key: 'acquirer', name: 'Acquirer'},
            {key: 'issuer', name: 'Issuer'},
            {key: 'commission', name: 'Commission'},
            {key: 'realtime', name: 'Realtime posting'},
            {key: 'pending', name: 'Authorization required'},
            {key: 'agent', name: 'Agent'},
            {key: 'fee', name: 'Fee'},
            {key: 'atm', name: 'ATM'},
            {key: 'pos', name: 'POS'},
            {key: 'ped', name: 'PED'}
        ];
    },
    defaultSelected(origin, selected) {
        let result = [];

        selected.forEach(function(row) {
            result.push(origin.filter(function(r) {
                return r.key === row.key;
            })[0]);
        });

        return result;
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
                          value={((split && split.splitName && split.splitName.name) || '')}
                        />
                    </div>
                    {displaySplitTags && <div className={style.splitInput}>
                        <MultiSelect
                          placeholder='Select Tags'
                          defaultSelected={self.defaultSelected(self.getTagData(), split.splitName.tag)}
                          onSelect={self.onChangeInput(index)}
                          data={self.getTagData()}
                          label='Tag'
                          keyProp='splitName.tag'
                        />
                    </div>}
                </div>
                <Accordion title='Cumulative' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                    <div className={style.content}>
                        <Cumulative
                          splitIndex={index}
                          data={split.splitCumulative}
                          channelData={this.props.channelData}
                          addSplitCumulativeRow={self.props.addSplitCumulativeRow}
                          deleteSplitCumulativeRow={self.props.deleteSplitCumulativeRow}
                          addSplitCumulativeRangeRow={self.props.addSplitCumulativeRangeRow}
                          deleteSplitCumulativeRangeRow={self.props.deleteSplitCumulativeRangeRow}
                        />
                    </div>
                </Accordion>
                <Accordion title='Assignment' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
                    <div className={style.content}>
                        <Assignment
                          splitIndex={index}
                          data={split.splitAssignment}
                          nomenclatures={this.context.nomenclatures}
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
                    Add split
                </span>
            </div>
        );
    }
});

export default Splits;
