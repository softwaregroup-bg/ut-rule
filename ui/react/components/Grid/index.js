import React, { PropTypes } from 'react';
import {SimpleGrid} from 'ut-front-react/components/SimpleGrid';
import ContextMenu from '../ContextMenu';
import style from './style.css';

export default React.createClass({
    propTypes: {
        data: PropTypes.object,
        columns: PropTypes.object,
        nomenclatures: PropTypes.object,
        formatedGridData: PropTypes.object,
        selectedConditions: PropTypes.object,
        refresh: PropTypes.func,
        handleCheckboxSelect: PropTypes.func,
        handleHeaderCheckboxSelect: PropTypes.func
    },
    getInitialState(state) {
        return {
            columns: this.props.columns
        };
    },
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    },
    renderGridColumn(condition, keysToInclude) {
        let result = [];
        keysToInclude.forEach((keyToInclude) => {
            if (Array.isArray(condition[keyToInclude])) {
                condition[keyToInclude].forEach((record) => {
                    result.push(<div key={result.length}>
                        <b>{`${record.name}: `}</b>{record.value}
                    </div>);
                });
            }
        });
        return result;
    },
    updateColumns(columns) {
        this.setState({
            columns: columns
        });
    },
    handleRowClick(record, index) {
        this.props.handleCheckboxSelect(null, record);
    },
    getData() {
        return Object.keys(this.props.data).map((conditionId, i) => {
            let record = this.props.data[conditionId];
            let condition = record.condition[0];
            let columns = this.state.columns;

            return {
                id: conditionId,
                priority: columns.priority.visible && condition.priority,
                channel: columns.channel.visible && this.props.formatedGridData[conditionId],
                operation: columns.operation.visible && this.props.formatedGridData[conditionId],
                source: columns.source.visible && this.props.formatedGridData[conditionId],
                destination: columns.destination.visible && this.props.formatedGridData[conditionId],
                limit: columns.limit.visible && this.props.formatedGridData[conditionId],
                refresh: ''
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
                    return this.renderGridColumn(value, ['cs', 'co']);
                case 'operation':
                    return this.renderGridColumn(value, ['oc']);
                case 'source':
                    return this.renderGridColumn(value, ['ss', 'sc', 'so']);
                case 'destination':
                    return this.renderGridColumn(value, ['ds', 'dc', 'do']);
                case 'limit':
                    return this.renderGridColumn(value, ['limit']);
                default:
                    return value;
            }
        }
    },
    render() {
        let data = this.getData();
        let columns = this.state.columns;

        return <SimpleGrid
          ref='grid'
          multiSelect
          fields={[
              {title: columns.priority.title, name: 'priority'},
              {title: columns.channel.title, name: 'channel'},
              {title: columns.operation.title, name: 'operation'},
              {title: columns.source.title, name: 'source'},
              {title: columns.destination.title, name: 'destination'},
              {title: columns.limit.title, name: 'limit'},
              {
                  title: <div style={{float: 'right'}}>
                    <ContextMenu
                      refresh={this.props.refresh}
                      onClose={this.updateColumns}
                      data={this.state.columns}
                    />
                  </div>,
                  name: 'refresh'
              }
          ].filter((column) => (!this.state.columns[column.name] || this.state.columns[column.name].visible))}
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
