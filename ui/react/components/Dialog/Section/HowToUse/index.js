import React from 'react';

const closedHeight = '20px';

const HowToUse = React.createClass({
    onEnter(e) {
        e.target.parentNode.style.height = 'auto';
    },
    onLeave(e) {
        e.target.parentNode.style.height = closedHeight;
    },
    render() {
        return (
            <div style={style}>
                <span onMouseEnter={this.onEnter} onMouseLeave={this.onLeave} style={{color: 'red'}}>How to use...</span>
                <p>
                    <b>1. Commissions:</b> If you want commissions to be calculated, when creating a split, mandatory tags are:<br />
                    <b>a.</b> Commission<br />
                    <b>b.</b> Authorization required<br />
                </p>
                <p>
                    <b>2. Fees:</b> For fees to be calculated, when creating a split, mandatory tags are:<br />
                    <b>a.</b> Issuer<br />
                    <b>b.</b> Realtime Authorization<br />
                    <b>c.</b> (Express Centre Agents) - Non Mandatory. Use If you want the selected product code in 'credit' field to be sent to FlexCube as product code
                </p>
            </div>
        );
    }
});

const style = {
    height: closedHeight,
    overflow: 'hidden',
    cursor: 'default',
    fontStyle: 'italic',
    color: 'gray'
};

export default HowToUse;
