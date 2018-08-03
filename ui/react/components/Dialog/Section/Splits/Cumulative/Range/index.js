import React, { PropTypes } from 'react';
import style from '../../../../style.css';
import Input from 'ut-front-react/components/Input';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import Checkbox from 'ut-front-react/components/Input/Checkbox';
import plusImage from '../../../../assets/add_new.png';
import Accordion from 'ut-front-react/components/Accordion';
import {isNumber} from '../../../../validations';

function stringifyNumber(n) {
    return isNumber(n) ? String(parseInt(n)) : null;
}

const Range = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        splitIndex: PropTypes.number.isRequired,
        cumulativeIndex: PropTypes.number.isRequired,
        addSplitRangeRow: PropTypes.func.isRequired
    },
    contextTypes: {
        onFieldChange: PropTypes.func,
        nomenclatures: PropTypes.object
    },
    onSelectDropdown(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('split.' + self.props.splitIndex + '.splitCumulative.' + self.props.cumulativeIndex + '.splitRange', index, field.key, field.value);
        };
    },
    onChangeInput(index) {
        let self = this;
        return (field) => {
            self.context.onFieldChange('split.' + self.props.splitIndex + '.splitCumulative.' + self.props.cumulativeIndex + '.splitRange', index, field.key, field.value);
        };
    },
    onDeleteRow(index) {
        let self = this;
        return () => {
            self.props.deleteSplitRangeRow(self.props.splitIndex, self.props.cumulativeIndex, index);
        };
    },
    createHeaderCells() {
        return [
            {name: 'Start Amount', key: 'startAmount'},
            {name: '%', key: 'percent'},
            {name: 'Min Amount', key: 'minValue'},
            {name: 'Max Amount', key: 'maxValue'},
            // {name: 'isSourceAmount', key: 'isSourceAmount'},
            {name: ' ', key: 'rangeActions'}
        ].map((cell, i) => (
            <th key={i}>{cell.name}</th>
        ));
    },
    createRangeRows() {
        var self = this;
        return this.props.data.map((splitRange, index) => (
            <tr key={index}>
                <td>
                    <Input
                      keyProp='startAmount'
                      onChange={this.onChangeInput(index)}
                      value={stringifyNumber(splitRange.startAmount)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='percent'
                      onChange={self.onChangeInput(index)}
                      value={'' + (splitRange.percent || '')}
                    />
                </td>
                <td>
                    <Input
                      keyProp='minValue'
                      onChange={self.onChangeInput(index)}
                      value={stringifyNumber(splitRange.minValue)}
                    />
                </td>
                <td>
                    <Input
                      keyProp='maxValue'
                      onChange={self.onChangeInput(index)}
                      value={stringifyNumber(splitRange.maxValue)}
                    />
                </td>
                {false &&
                    <td style={{textAlign: 'center'}}>
                        <Checkbox
                          onClick={this.onCheckboxCheck(index, splitRange)}
                          checked={splitRange.isSourceAmount}
                        />
                    </td>
                }
                <td>
                    <IconButton onClick={this.onDeleteRow(index)}>
                        <ActionDelete />
                    </IconButton>
                </td>
            </tr>
        ));
    },
    render() {
        return (
           <Accordion title='Range' fullWidth externalTitleClasses={style.title} externalBodyClasses={style.body}>
              <div className={style.content}>
                  <table className={style.dataGridTable}>
                      <thead>
                          <tr>
                              {this.createHeaderCells()}
                          </tr>
                      </thead>
                      <tbody className={style.limitTableBody}>
                          {this.createRangeRows()}
                      </tbody>
                  </table>
                  <span className={style.link} onClick={this.props.addSplitRangeRow(this.props.splitIndex, this.props.cumulativeIndex)}>
                      <img src={plusImage} className={style.plus} />
                      Add another range
                  </span>
              </div>
          </Accordion>
        );
    }
});

export default Range;
