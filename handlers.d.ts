declare namespace rule.decision.fetch {
  export interface params {
    channelCountryId?: number | null;
    channelRegionId?: number | null;
    channelCityId?: number | null;
    channelOrganizationId?: number | null;
    channelSupervisorId?: number | null;
    channelTags?: string;
    channelRoleId?: number | null;
    channelId?: number | null;
    operationId?: number | null;
    operationTags?: string;
    operationDate?: Date;
    sourceCountryId?: number | null;
    sourceRegionId?: number | null;
    sourceCityId?: number | null;
    sourceOrganizationId?: number | null;
    sourceSupervisorId?: number | null;
    sourceTags?: string;
    sourceId?: number | null;
    sourceProductId?: number | null;
    sourceAccountId?: number | null;
    destinationCountryId?: number | null;
    destinationRegionId?: number | null;
    destinationCityId?: number | null;
    destinationOrganizationId?: number | null;
    destinationSupervisorId?: number | null;
    destinationTags?: string;
    destinationId?: number | null;
    destinationProductId?: number | null;
    destinationAccountId?: number | null;
    amount: number;
    currency: string;
    isSourceAmount?: 0 | 1 | '0' | '1';
    /**
     * Unknown Property
     */
    [x: string]: any;
  }
  export interface result {
    fee?: {
      amount?: number;
    };
    commission?: {
      amount?: number;
    };
    limit?: {
      minAmount?: number | null;
      maxAmount?: number | null;
      count?: number | null;
    };
  }
}

declare namespace rule.decision.lookup {
  export interface params {
    channelId?: number | null;
    operation: string;
    sourceAccount: string;
    destinationAccount: string;
    amount: number;
    currency: string;
    isSourceAmount?: 0 | 1 | '0' | '1';
    sourceCardProductId?: number | null;
  }
  export interface result {
    amount?: {
      acquirerFee?: number | null;
      issuerFee?: number | null;
      processorFee?: number | null;
      commission?: number | null;
      transferDateTime: Date;
      transferTypeId: string;
    };
    split?: ({
    conditionId: number;
    splitNameId: number;
    tag: string | null;
    amount: number;
    debit: string;
    credit: string;
    description?: string | null;
    analytics?: string | null;
  })[];
  }
}

declare namespace rule.item.fetch {
  export type params = any;
  export type result = any;
}

declare namespace rule.limitForUserByRole.get {
  export interface params {
    userId: number;
    operation?: string;
    currency?: string;
    property?: string;
    nextLevel?: boolean;
    approvedAmount?: number;
  }
  export type result = any;
}

declare namespace rule.rule.add {
  export type params = any;
  export type result = any;
}

declare namespace rule.rule.edit {
  export type params = any;
  export type result = any;
}

declare namespace rule.rule.fetch {
  export type params = any;
  export type result = any;
}

declare namespace rule.rule.remove {
  export type params = any;
  export type result = any;
}

import ut from 'ut-run';
export interface handlers {
  'rule.decision.fetch': ut.remoteHandler<rule.decision.fetch.params, rule.decision.fetch.result>,
  ruleDecisionFetch: ut.remoteHandler<rule.decision.fetch.params, rule.decision.fetch.result>,
  'rule.decision.lookup': ut.remoteHandler<rule.decision.lookup.params, rule.decision.lookup.result>,
  ruleDecisionLookup: ut.remoteHandler<rule.decision.lookup.params, rule.decision.lookup.result>,
  'rule.item.fetch': ut.remoteHandler<rule.item.fetch.params, rule.item.fetch.result>,
  ruleItemFetch: ut.remoteHandler<rule.item.fetch.params, rule.item.fetch.result>,
  'rule.limitForUserByRole.get': ut.remoteHandler<rule.limitForUserByRole.get.params, rule.limitForUserByRole.get.result>,
  'rule.rule.add': ut.remoteHandler<rule.rule.add.params, rule.rule.add.result>,
  ruleRuleAdd: ut.remoteHandler<rule.rule.add.params, rule.rule.add.result>,
  'rule.rule.edit': ut.remoteHandler<rule.rule.edit.params, rule.rule.edit.result>,
  ruleRuleEdit: ut.remoteHandler<rule.rule.edit.params, rule.rule.edit.result>,
  'rule.rule.fetch': ut.remoteHandler<rule.rule.fetch.params, rule.rule.fetch.result>,
  ruleRuleFetch: ut.remoteHandler<rule.rule.fetch.params, rule.rule.fetch.result>,
  'rule.rule.remove': ut.remoteHandler<rule.rule.remove.params, rule.rule.remove.result>,
  ruleRuleRemove: ut.remoteHandler<rule.rule.remove.params, rule.rule.remove.result>
}

export interface errors {
  'error.rule': ut.error,
  'error.rule.duplicatedPriority': ut.error,
  errorRuleDuplicatedPriority: ut.error,
  'error.rule.exceedDailyLimitAmount': ut.error,
  errorRuleExceedDailyLimitAmount: ut.error,
  'error.rule.exceedDailyLimitCount': ut.error,
  errorRuleExceedDailyLimitCount: ut.error,
  'error.rule.exceedMaxLimitAmount': ut.error,
  errorRuleExceedMaxLimitAmount: ut.error,
  'error.rule.exceedMinLimitAmount': ut.error,
  errorRuleExceedMinLimitAmount: ut.error,
  'error.rule.exceedMonthlyLimitAmount': ut.error,
  errorRuleExceedMonthlyLimitAmount: ut.error,
  'error.rule.exceedMonthlyLimitCount': ut.error,
  errorRuleExceedMonthlyLimitCount: ut.error,
  'error.rule.exceedWeeklyLimitAmount': ut.error,
  errorRuleExceedWeeklyLimitAmount: ut.error,
  'error.rule.exceedWeeklyLimitCount': ut.error,
  errorRuleExceedWeeklyLimitCount: ut.error,
  'error.rule.generic': ut.error,
  errorRuleGeneric: ut.error,
  'error.rule.reachedDailyLimitAmount': ut.error,
  errorRuleReachedDailyLimitAmount: ut.error,
  'error.rule.reachedMonthlyLimitAmount': ut.error,
  errorRuleReachedMonthlyLimitAmount: ut.error,
  'error.rule.reachedWeeklyLimitAmount': ut.error,
  errorRuleReachedWeeklyLimitAmount: ut.error,
  'error.rule.ruleNotExists': ut.error,
  errorRuleRuleNotExists: ut.error,
  'error.rule.securityViolation': ut.error,
  errorRuleSecurityViolation: ut.error,
  'error.rule.unauthorizedDailyLimitAmount': ut.error,
  errorRuleUnauthorizedDailyLimitAmount: ut.error,
  'error.rule.unauthorizedDailyLimitCount': ut.error,
  errorRuleUnauthorizedDailyLimitCount: ut.error,
  'error.rule.unauthorizedMaxLimitAmount': ut.error,
  errorRuleUnauthorizedMaxLimitAmount: ut.error,
  'error.rule.unauthorizedMinLimitAmount': ut.error,
  errorRuleUnauthorizedMinLimitAmount: ut.error,
  'error.rule.unauthorizedMonthlyLimitAmount': ut.error,
  errorRuleUnauthorizedMonthlyLimitAmount: ut.error,
  'error.rule.unauthorizedMonthlyLimitCount': ut.error,
  errorRuleUnauthorizedMonthlyLimitCount: ut.error,
  'error.rule.unauthorizedWeeklyLimitAmount': ut.error,
  errorRuleUnauthorizedWeeklyLimitAmount: ut.error,
  'error.rule.unauthorizedWeeklyLimitCount': ut.error,
  errorRuleUnauthorizedWeeklyLimitCount: ut.error
}

import login from 'ut-login/handlers'
interface methods extends login.handlers {}

import core from 'ut-core/handlers'
interface methods extends core.handlers {}

export type libFactory = ut.libFactory<methods, errors>
export type handlerFactory = ut.handlerFactory<methods, errors>
export type handlerSet = ut.handlerSet<methods, errors>
