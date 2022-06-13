import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from 'ut-front-react/components/PageLayout/Page';
import { Vertical } from 'ut-front-react/components/Layout';
import Header from 'ut-front-react/components/PageLayout/Header';
import { AddTab } from 'ut-front-react/containers/TabMenu';
import { getLink } from 'ut-front-react/routerHelper';
import { removeTab, updateTabTitle } from 'ut-front-react/containers/TabMenu/actions';
import Container from 'ut-front-react/components/PageLayout/Container';
import Content from 'ut-front-react/components/PageLayout/Content';
import ConfirmRejectionDialog from 'ut-front-react/components/ConfirmRejectionDialog';
import CompareGrid from 'ut-front-react/components/CompareGrid';
import { connect } from 'react-redux';
import immutable from 'immutable';
import {
    getSingleRule,
    setActiveTab,
    closeConfirmDialog,
    openConfirmDialog,
    changeConfirmDialogValue,
    updateErrors,
    approveRule,
    rejectRuleChanges,
    discardRuleChanges
} from '../actions';
import { defaultState } from '../reducer';
import {
    mapGeneralInfoData,
    operationInfoData,
    sourceInfoData,
    destinationInfoData,
    splitInfoData
} from '../markerCheckerHelper';

const baseTabTitle = 'Validate Rule ';
const messages = {
    approve: 'Are you sure you want to approve the changes?',
    reject: 'Are you sure you want to reject the changes?',
    discard: 'Are you sure you want to discard the changes you have previously made ?'
};

const splitCheckers = [
    { title: 'Split Name', key: 'splitName' },
    { title: 'Split Assignment', key: 'splitAssignment' },
    { title: 'Split Range', key: 'splitRange' },
    { title: 'Split Limit', key: 'limit' },
    { title: 'Split Analytic', key: 'splitAnalytic' }
];

class RuleApprove extends Component {
    constructor(props, context) {
        super(props, connect);
        this.permissions = {
            canApprove: context.checkPermission('rule.rule.approve'),
            canReject: context.checkPermission('rule.rule.reject'),
            canEdit: context.checkPermission('rule.rule.edit'),
            canDiscard: context.checkPermission('rule.rule.edit')
        };
        this.getButtons = this.getButtons.bind(this);
        this.handleApproval = this.handleApproval.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleRejection = this.handleRejection.bind(this);
        this.getMakerCheckerValues = this.getMakerCheckerValues.bind(this);
        this.handleDiscard = this.handleDiscard.bind(this);
    }

    componentWillMount() {
        const id = this.props.match.params.id;
        this.props.setActiveTab({
            mode: 'approve',
            id
        });
        this.props.getSingleRule({ conditionId: id });
    }

    componentWillReceiveProps({ canSubmit, match, currentValues, activeTabData }) {
        if (this.props.match.params.id !== match.params.id) {
            this.props.getSingleRule({ conditionId: match.params.id });
        }
        if (this.props.canSubmit !== canSubmit) {
            this.forceUpdate();
        }
        if (activeTabData.get('id') !== this.props.match.params.id) {
            this.props.setActiveTab({
                mode: 'approve',
                id: this.props.match.params.id
            });
        }
    // if (!this.state.updatedTitle && currentValues && currentValues.getIn(['person']) && currentValues.getIn(['person']).size > 0) {
    //   const user = currentValues.getIn(['person']);
    //   const id = user.get('actorId');
    //   const pathname = getLink('ut-user:userValidate', { id });
    //   const newTitle = baseTabTitle
    //   this.props.updateTabTitle(pathname, newTitle);
    //   this.setState({
    //     updatedTitle: true
    //   });
    // }
    }

    handleApproval() {
        const conditionId = this.props.match.params.id;
        const { canApprove } = this.permissions;
        if (canApprove) {
            this.props.approveRule({ conditionId: conditionId });
            this.props.removeTab(this.props.activeTab.pathname);
            this.props.closeConfirmDialog();
        }
    }

    handleRejection() {
        const cd = this.props.confirmDialog.toJS();
        const conditionId = this.props.match.params.id;
        const { canReject } = this.permissions;
        if (canReject) {
            this.props.rejectRuleChanges(conditionId, cd.value);
            this.props.closeConfirmDialog();
            this.props.removeTab(this.props.activeTab.pathname);
        }
    }

    handleDialogOpen(config) {
        return () => this.props.openConfirmDialog(config);
    }

    handleDiscard(conditionId) {
        const { canDiscard } = this.permissions;
        if (canDiscard) {
            return () => {
                this.props.discardRuleChanges(conditionId);
                this.props.closeConfirmDialog();
                this.props.removeTab(this.props.activeTab.pathname);
            };
        }
    }

    handleClose() {
        this.props.removeTab(this.props.activeTab.pathname);
    }

    getButtons() {
        const { canApprove, canEdit } = this.permissions;
        const { currentValues, newValues } = this.props;
        const conditionId = newValues.getIn(['condition', 'conditionId']);
        const isRejected = newValues.getIn(['condition', 'status']) === 'rejected';
        const isDeleted = newValues.getIn(['condition', 'isDeleted']);
        const isLocked = !currentValues.getIn(['condition', 'isEnabled']);
        const approveDialogConfig = {
            isOpen: true,
            showInput: false,
            message: messages.approve,
            buttons: [
                { label: 'Confirm', onClick: this.handleApproval },
                { label: 'Cancel', onClick: this.props.closeConfirmDialog }
            ]
        };
        const rejectReasonDialogConfig = {
            isOpen: true,
            showInput: true,
            title: 'enter reject reason',
            message: '',
            buttons: [
                { label: 'Submit', onClick: this.handleRejection, disabled: !this.props.canSubmit },
                { label: 'Cancel', onClick: this.props.closeConfirmDialog }
            ]
        };
        const rejectDialogConfig = {
            isOpen: true,
            title: 'confirm rejection',
            message: messages.reject,
            showInput: false,
            canSubmit: true,
            buttons: [
                { label: 'Reject', onClick: this.handleDialogOpen(rejectReasonDialogConfig) },
                { label: 'Cancel', onClick: this.props.closeConfirmDialog }
            ]
        };

        const discardChangesDialogConfig = {
            isOpen: true,
            title: 'DISCARD CHANGES MADE',
            message: messages.discard,
            showInput: false,
            canSubmit: true,
            buttons: [
                { label: 'Discard', onClick: this.handleDiscard(conditionId) },
                { label: 'Cancel', onClick: this.props.closeConfirmDialog }
            ]
        };

        const buttonsMaker = [
            {
                text: 'Discard changes',
                onClick: this.handleDialogOpen(discardChangesDialogConfig)
            },
            {
                text: 'Cancel',
                onClick: this.handleClose
            }
        ];

        if (!isDeleted || !isLocked) {
            buttonsMaker.unshift({
                text: 'Edit',
                href: getLink('ut-rule:edit', { id: conditionId })
            });
        }

        const buttonsCheker = [
            {
                text: 'Approve',
                onClick: this.handleDialogOpen(approveDialogConfig)
            },
            {
                text: 'Reject',
                onClick: this.handleDialogOpen(rejectDialogConfig)
            },
            {
                text: 'Close',
                onClick: this.handleClose
            }
        ];
        if (canApprove && !isRejected) {
            return buttonsCheker;
        } else if (canEdit && isRejected) {
            return buttonsMaker;
        } else {
            return [
                {
                    text: 'Cancel',
                    href: getLink('ut-rule:rules')
                }
            ];
        }
    }

    getMakerCheckerValues() {
        let { currentValues, newValues } = this.props;
        // console.log('this.props current', currentValues.toJS());
        // console.log('this.props new', newValues.toJS());
        const isNew = currentValues.getIn(['condition', 'isNew']);
        const isDeleted = newValues.getIn(['condition', 'isDeleted']);
        const isRejected = currentValues.getIn(['condition', 'status']) === 'rejected';

        if (isNew) {
            newValues = currentValues;
        }
        if (isDeleted || isRejected) {
            newValues = currentValues;
        }
        if (currentValues.getIn(['condition', 'isEnabled'])) {
            newValues = currentValues.set('condition', newValues.get('condition'));
        }

        const options = { isNew, isDeleted };

        return immutable.fromJS([
            mapGeneralInfoData(currentValues, newValues, options),
            operationInfoData(currentValues, newValues, options),
            sourceInfoData(currentValues, newValues, options),
            destinationInfoData(currentValues, newValues, options),
            ...splitCheckers.map(item => splitInfoData(currentValues, newValues, options, item.title, item.key))
        ]).filter(result => result);
    }

    render() {
        const { id, newValues, location, confirmDialog, value, errors, canSubmit, updateErrors, changeConfirmDialogValue } = this.props;

        const rejectReason = newValues.getIn(['condition', 'rejectReason']);
        const isNew = newValues.getIn(['condition', 'isNew']) || null;
        const isDeleted = newValues.getIn(['condition', 'isDeleted']) || null;
        const isRejected = newValues.getIn(['condition', 'status']) === 'rejected';
        const compareGridStaticStrings = {
            headingIsNew: 'New Rule',
            headingWillBeDeleted: 'Rule will be deleted'
        };

        const pathname = getLink('ut-rule:validate', { id });
        // const rule = currentValues.condition || newValues.condition

        const title = confirmDialog.get('title');
        const buttons = confirmDialog.get('buttons');
        const isOpen = confirmDialog.get('isOpen');
        const showInput = confirmDialog.get('showInput');
        const message = confirmDialog.get('message');

        return (
            <Page>
                <AddTab pathname={pathname} title={baseTabTitle} />
                <Vertical fixedComponent={
                    <Header
                        text={baseTabTitle}
                        location={location}
                        buttons={this.getButtons()}
                    />
                }
                >
                    <Container bordered={false}>
                        <Content style={{ overflow: 'auto' }}>
                            <CompareGrid
                                data={this.getMakerCheckerValues()}
                                isNew={isNew}
                                isDeleted={isDeleted}
                                isRejected={isRejected}
                                rejectReason={isRejected ? rejectReason : null}
                                staticStrings={compareGridStaticStrings}
                            />
                        </Content>
                    </Container>
                    <ConfirmRejectionDialog
                        id={id}
                        title={title}
                        buttons={buttons}
                        isOpen={isOpen}
                        showInput={showInput}
                        message={message}
                        value={value}
                        errors={errors}
                        canSubmit={canSubmit}
                        changeConfirmDialogValue={changeConfirmDialogValue}
                        updateErrors={updateErrors}
                    />
                </Vertical>
            </Page>
        );
    }
}

RuleApprove.contextTypes = {
    checkPermission: PropTypes.func
};

RuleApprove.propTypes = {
    // actions
    getSingleRule: PropTypes.func,
    setActiveTab: PropTypes.func,
    changeConfirmDialogValue: PropTypes.func,
    openConfirmDialog: PropTypes.func,
    closeConfirmDialog: PropTypes.func,
    removeTab: PropTypes.func,
    updateErrors: PropTypes.func,
    approveRule: PropTypes.func,
    rejectRuleChanges: PropTypes.func,
    updateTabTitle: PropTypes.func,
    discardRuleChanges: PropTypes.func,
    // data
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    id: PropTypes.any,
    newValues: PropTypes.object,
    value: PropTypes.string,
    activeTab: PropTypes.object,
    activeTabData: PropTypes.any,
    currentValues: PropTypes.object,
    confirmDialog: PropTypes.object,
    languages: PropTypes.object,
    canSubmit: PropTypes.bool,
    errors: PropTypes.object

};

const mapStateToProps = (state, ownProps) => {
    // console.log('state in rule approve', state.ruleProfileReducer.toJS());
    // console.log('state in rule state', state);
    const tab = state.ruleProfileReducer.getIn(['approve', ownProps.match.params.id]) || immutable.fromJS(defaultState);

    const currentValues = immutable.fromJS({
        condition: tab.getIn(['localData', 'condition']),
        conditionActor: tab.getIn(['localData', 'conditionActor']),
        conditionProperty: tab.getIn(['localData', 'conditionProperty']),
        conditionItem: tab.getIn(['localData', 'conditionItem']),
        limit: tab.getIn(['localData', 'limit']),
        splitName: tab.getIn(['localData', 'splitName']),
        splitAssignment: tab.getIn(['localData', 'splitAssignment']),
        splitAnalytic: tab.getIn(['localData', 'splitAnalytic']),
        splitRange: tab.getIn(['localData', 'splitRange'])
    });

    const newValues = immutable.fromJS({
        condition: tab.getIn(['localData', 'conditionUnapproved']),
        conditionActor: tab.getIn(['localData', 'conditionActorUnapproved']),
        conditionProperty: tab.getIn(['localData', 'conditionPropertyUnapproved']),
        conditionItem: tab.getIn(['localData', 'conditionItemUnapproved']),
        limit: tab.getIn(['localData', 'limitUnapproved']),
        splitName: tab.getIn(['localData', 'splitNameUnapproved']),
        splitAssignment: tab.getIn(['localData', 'splitAssignmentUnapproved']),
        splitAnalytic: tab.getIn(['localData', 'splitAnalyticUnapproved']),
        splitRange: tab.getIn(['localData', 'splitRangeUnapproved'])
    });

    // console.log('state currentvalues', currentValues.toJS());
    // console.log('state newvalues', newValues.toJS());

    return {
        id: ownProps.match.params.id,
        currentValues,
        newValues,
        activeTab: state.tabMenu.active,
        activeTabData: state.ruleProfileReducer.get('activeTab'),
        confirmDialog: state.ruleProfileReducer.getIn(['common', 'confirmDialog']),
        canSubmit: state.ruleProfileReducer.getIn(['common', 'confirmDialog', 'canSubmit']),
        value: state.ruleProfileReducer.getIn(['common', 'confirmDialog', 'value']),
        errors: tab.getIn(['errors']) || immutable.fromJS({})
    };
};

export default connect(
    mapStateToProps,
    {
        getSingleRule,
        setActiveTab,
        removeTab,
        closeConfirmDialog,
        openConfirmDialog,
        changeConfirmDialogValue,
        updateErrors,
        approveRule,
        rejectRuleChanges,
        updateTabTitle,
        discardRuleChanges
    }
)(RuleApprove);
