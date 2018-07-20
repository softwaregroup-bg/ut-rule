import React, { PropTypes } from 'react';
import {fromJS} from 'immutable';
import ReloadIcon from 'material-ui/svg-icons/action/autorenew';
import {SimpleGrid} from 'ut-front-react/components/SimpleGrid';
import style from './style.css';
import {getStorageColumns, toggleColumnInStorage} from 'ut-front-react/components/SimpleGrid/helpers';
const propInStorage = 'rules';

export default React.createClass({
    propTypes: {
        data: PropTypes.object,
        columns: PropTypes.object,
        formatedGridData: PropTypes.object,
        selectedConditions: PropTypes.object,
        refresh: PropTypes.func,
        handleCheckboxSelect: PropTypes.func,
        handleHeaderCheckboxSelect: PropTypes.func
    },
    getInitialState() {
        return {
            columns: this.props.columns,
            fields: [
                {title: this.props.columns.priority.title, name: 'priority', visible: true},
                {title: this.props.columns.channel.title, name: 'channel', visible: true},
                {title: this.props.columns.operation.title, name: 'operation', visible: true},
                {title: this.props.columns.source.title, name: 'source', visible: true},
                {title: this.props.columns.destination.title, name: 'destination', visible: true},
                {title: this.props.columns.limit.title, name: 'limit', visible: true}
            ]
        };
    },
    componentWillMount() {
        this.setVisibleColumns();
    },
    setVisibleColumns() {
        let invisibleColumns = getStorageColumns(propInStorage);
        let fieldsWithVisibility = this.state.fields.map((field) => {
            if (invisibleColumns.includes(field['name'])) {
                field['visible'] = false;
            }
            return field;
        });
        this.setState({fields: fieldsWithVisibility});
    },
    renderGridColumn(condition, keysToInclude, row, column) {
        let result = [];
        for (let keyToInclude of keysToInclude) {
            if (Array.isArray(condition[keyToInclude])) {
                for (let index in condition[keyToInclude]) {
                    let record = condition[keyToInclude][index];
                    result.push(<div key={result.length}>
                        <b>{record.name + ':'}</b>{record.value}
                    </div>);
                }
            }
        }
        if (row.operationEndDate && column === 'operation') {
            result.push(
              <div key={result.length}>
                  <b>End Date: </b>{row.operationEndDate.slice(0, 10)}
              </div>
            );
        }
        if (row.operationStartDate && column === 'operation') {
            result.push(
              <div key={result.length}>
                  <b>Start Date: </b>{row.operationStartDate.slice(0, 10)}
              </div>
            );
        }
        if (row.destinationAccountId && column === 'destination') {
            result.push(
              <div key={result.length}>
                  <b>Destination Account: </b>{row.destinationAccountId}
              </div>
            );
        }
        return (
          <div>
            {result}
          </div>
        );
    },
    updateColumns(columns) {
        this.setState({
            columns: columns
        });
    },
    handleRowClick(record, index) {
        this.props.handleCheckboxSelect(null, record);
    },
    toggleColumn(field) {
        let stateFields = this.state.fields;
        stateFields.map(stateField => {
            if (stateField.name === field.name) {
                toggleColumnInStorage(propInStorage, field.name);
                stateField.visible = !stateField.visible;
            }
        });
        this.setState({fields: stateFields});
    },
    getData() {
        return Object.keys(this.props.data).map((conditionId, i) => {
            let record = this.props.data[conditionId];
            let condition = record.condition[0];
            let columns = this.state.columns;
            return {
                id: conditionId,
                destinationAccountId: condition.destinationAccountId,
                operationEndDate: condition.operationEndDate,
                operationStartDate: condition.operationStartDate,
                priority: columns.priority.visible && condition.priority,
                channel: columns.channel.visible && this.props.formatedGridData[conditionId],
                operation: columns.operation.visible && this.props.formatedGridData[conditionId],
                source: columns.source.visible && this.props.formatedGridData[conditionId],
                destination: columns.destination.visible && this.props.formatedGridData[conditionId],
                limit: columns.limit.visible && this.props.formatedGridData[conditionId],
                split: columns.split && columns.split.visible && this.props.formatedGridData[conditionId]
            };
        });
    },
    transformCellValue(value, header, row, isHeader) {
        if (isHeader) {
            return value;
        } else {
            if (!value) {
                return;
            }
            switch (header.name) {
                case 'channel':
                    return this.renderGridColumn(value, ['cs', 'co'], row, 'channel');
                case 'operation':
                    return this.renderGridColumn(value, ['oc'], row, 'operation');
                case 'source':
                    return this.renderGridColumn(value, ['ss', 'sc', 'so'], row, 'source');
                case 'destination':
                    return this.renderGridColumn(value, ['ds', 'dc', 'do'], row, 'destination');
                case 'limit':
                    return this.renderGridColumn(value, ['limit'], row, 'limit');
                case 'split':
                    return this.renderGridColumn(value, ['split'], row, 'split');
                default:
                    return value;
            }
        }
    },
    render() {
        let data = fromJS(this.getData()).sort((a, b) => {
            return b.get('priority') - a.get('priority');
        }).toJS();
        let fields = [{
            title: (<div className={style.reloadCol} onClick={this.props.refresh}>
                <span> <ReloadIcon /> </span> <label>Refresh</label>
            </div>),
            name: 'refresh',
            visible: false
        }, ...this.state.fields].filter((column) => (!this.state.columns[column.name] || this.state.columns[column.name].visible));
        return <SimpleGrid
          globalMenu
          toggleColumnVisibility={this.toggleColumn}
          multiSelect
          fields={fields}
          handleCheckboxSelect={this.props.handleCheckboxSelect}
          handleHeaderCheckboxSelect={this.props.handleHeaderCheckboxSelect}
          handleRowClick={this.handleRowClick}
          externalStyle={style}
          mainClassName='dataGridTable'
          rowsChecked={data.filter(x => this.props.selectedConditions[x.id])}
          data={data}
          transformCellValue={this.transformCellValue}
        />;
    }
});
