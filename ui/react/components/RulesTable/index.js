import React, { PropTypes } from 'react';

export default React.createClass({
    propTypes: {
        data: PropTypes.array
    },
    render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Priority</th>
                        <th>Channel</th>
                        <th>Source</th>
                        <th>Destination</th>
                        <th>Amount</th>
                        <th>Fee</th>
                        <th>Limit</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.data.map((record, i) => {
                            let condition = record.condition[0];
                            return (
                                <tr key={i}>
                                    <td>{condition.priority}</td>
                                    <td>Channel</td>
                                    <td>Source</td>
                                    <td>Destination</td>
                                    <td>Amount</td>
                                    <td>Fee</td>
                                    <td>Limit</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        );
    }
});
