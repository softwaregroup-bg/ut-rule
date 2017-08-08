import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
// import {bindActionCreators} from 'redux'

import SimpleGridToolbox from 'ut-front-react/components/SimpleGridToolbox'
// import { setPurpose, toggleDialogVisibility } from '../Details/actions'

import style from './style.css'

const contextTypes = {
  router: PropTypes.object,
  checkPermission: PropTypes.func
}

const propTypes = {
  canClickDetails: PropTypes.bool.isRequired,
  setPurpose: PropTypes.func.isRequired,
  toggleDialogVisibility: PropTypes.func.isRequired
}

class RuleGridToolbox extends Component {
  constructor (props) {
    super(props)
  }

  getToolboxButtons () {
    let className = 'button btn btn-primary'
    let buttons = [
      <button
        onClick={() => {}}
        className={className}
        key='details'
      >
        Details
      </button>
      <button
        onClick={() => {}}
        className={className}
        key='delete'
      >
        Delete
      </button>
    ]
    return buttons
  }

  renderToolboxButtons () {
    return (
      <div className={style.filterWrap}>
        <div className={style.buttonWrap}>
          {this.getToolboxButtons()}
        </div>
      </div>
    )
  }

  render () {
    return (
      <SimpleGridToolbox opened title='Actions'>
        {this.renderToolboxButtons()}
      </SimpleGridToolbox>
    )
  }
}

NotificationsTemplatesGridToolbox.contextTypes = contextTypes
NotificationsTemplatesGridToolbox.propTypes = propTypes

const mapStateToProps = (state, ownProps) => ({
//   canClickDetails: state.notificationsTemplatesGrid.get('rowsChecked').size === 1
})

const mapDispatchToProps = {
//   setPurpose, toggleDialogVisibility
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsTemplatesGridToolbox)