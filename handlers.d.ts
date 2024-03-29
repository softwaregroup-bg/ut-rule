declare namespace ruleTableTypes {}
declare namespace rule_condition_add {
  export interface params {
    /**
     * Unknown Property
     */
    [x: string]: unknown;
    channel?: {
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    condition?: {
      conditionId?: number | string;
      decision?: object | null;
      description?: string | null;
      destinationAccountId?: string | null;
      name: string;
      notes?: string | null;
      operationEndDate?: Date | null;
      operationStartDate?: Date | null;
      priority?: number | null;
      sourceAccountId?: string | null;
    };
    destination?: {
      accountFeePolicy?: (number | string)[] | null;
      accountProduct?: (number | string)[] | null;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      cardProduct?: (number | string)[] | null;
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      customerType?: (number | string)[] | null;
      kyc?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    limit?: ({
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      amountType?: any | null | 1 | 2;
      conditionId?: number | string;
      credentials?: number | null;
      currency: string;
      limitId?: number | string;
      maxAmount?: number | null;
      maxAmountDaily?: number | null;
      maxAmountMonthly?: number | null;
      maxAmountWeekly?: number | null;
      maxCountDaily?: number | string;
      maxCountMonthly?: number | string;
      maxCountWeekly?: number | string;
      minAmount?: number | null;
      priority?: number | null;
    })[];
    operation?: {
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      tag?: string | null | '';
      transferTag?: string | null | '';
      type?: any[] | null;
    };
    rate?: ({
      conditionId?: number | string;
      rate: number;
      rateId?: number | string;
      startAmount?: number | null;
      startAmountCurrency: string;
      startAmountDaily?: number | null;
      startAmountMonthly?: number | null;
      startAmountWeekly?: number | null;
      startCountDaily?: number | string;
      startCountMonthly?: number | string;
      startCountWeekly?: number | string;
      targetCurrency: string;
    })[];
    source?: {
      accountFeePolicy?: (number | string)[] | null;
      accountProduct?: (number | string)[] | null;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      cardProduct?: (number | string)[] | null;
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      customerType?: (number | string)[] | null;
      kyc?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    splitAnalytic?: ({
      name?: string | null;
      splitAnalyticId: number;
      splitAssignmentId: number;
      value?: string | null;
    })[];
    splitAssignment?: ({
      credit: string;
      debit: string;
      description: string;
      maxValue?: number | null;
      minValue?: number | null;
      percent?: number | null;
      quantity?: string | null;
      splitAssignmentId: number;
      splitNameId: number;
    })[];
    splitName?: ({
      amountType?: any | null | 1 | 2;
      conditionId: number | string;
      name: string;
      splitNameId: number;
      tag?: string[];
    })[];
    splitRange?: ({
      isSourceAmount?: true | false | 0 | 1 | '0' | '1' | null;
      maxValue?: number | null;
      minValue?: number | null;
      percent?: number | null;
      percentBase?: number | null;
      splitNameId: number;
      splitRangeId: number;
      startAmount: number;
      startAmountCurrency: string;
      startAmountDaily: number;
      startAmountMonthly: number;
      startAmountWeekly: number;
      startCountDaily: number | string;
      startCountMonthly: number | string;
      startCountWeekly: number | string;
    })[];
  }
  export interface result {
    /**
     * Unknown Property
     */
    [x: string]: unknown;
    channel?: {
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    condition?: {
      conditionId?: number | string;
      decision?: object | null;
      description?: string | null;
      destinationAccountId?: string | null;
      name: string;
      notes?: string | null;
      operationEndDate?: Date | null;
      operationStartDate?: Date | null;
      priority?: number | null;
      sourceAccountId?: string | null;
    };
    destination?: {
      accountFeePolicy?: (number | string)[] | null;
      accountProduct?: (number | string)[] | null;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      cardProduct?: (number | string)[] | null;
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      customerType?: (number | string)[] | null;
      kyc?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    limit?: ({
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      amountType?: any | null | 1 | 2;
      conditionId?: number | string;
      credentials?: number | null;
      currency: string;
      limitId?: number | string;
      maxAmount?: number | null;
      maxAmountDaily?: number | null;
      maxAmountMonthly?: number | null;
      maxAmountWeekly?: number | null;
      maxCountDaily?: number | string;
      maxCountMonthly?: number | string;
      maxCountWeekly?: number | string;
      minAmount?: number | null;
      priority?: number | null;
    })[];
    operation?: {
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      tag?: string | null | '';
      transferTag?: string | null | '';
      type?: any[] | null;
    };
    rate?: ({
      conditionId?: number | string;
      rate: number;
      rateId?: number | string;
      startAmount?: number | null;
      startAmountCurrency: string;
      startAmountDaily?: number | null;
      startAmountMonthly?: number | null;
      startAmountWeekly?: number | null;
      startCountDaily?: number | string;
      startCountMonthly?: number | string;
      startCountWeekly?: number | string;
      targetCurrency: string;
    })[];
    source?: {
      accountFeePolicy?: (number | string)[] | null;
      accountProduct?: (number | string)[] | null;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      cardProduct?: (number | string)[] | null;
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      customerType?: (number | string)[] | null;
      kyc?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    splitAnalytic?: ({
      name?: string | null;
      splitAnalyticId: number;
      splitAssignmentId: number;
      value?: string | null;
    })[];
    splitAssignment?: ({
      credit: string;
      debit: string;
      description: string;
      maxValue?: number | null;
      minValue?: number | null;
      percent?: number | null;
      quantity?: string | null;
      splitAssignmentId: number;
      splitNameId: number;
    })[];
    splitName?: ({
      amountType?: any | null | 1 | 2;
      conditionId: number | string;
      name: string;
      splitNameId: number;
      tag?: string[];
    })[];
    splitRange?: ({
      isSourceAmount?: true | false | 0 | 1 | '0' | '1' | null;
      maxValue?: number | null;
      minValue?: number | null;
      percent?: number | null;
      percentBase?: number | null;
      splitNameId: number;
      splitRangeId: number;
      startAmount: number;
      startAmountCurrency: string;
      startAmountDaily: number;
      startAmountMonthly: number;
      startAmountWeekly: number;
      startCountDaily: number | string;
      startCountMonthly: number | string;
      startCountWeekly: number | string;
    })[];
  }
}

declare namespace rule_condition_edit {
  export interface params {
    /**
     * Unknown Property
     */
    [x: string]: unknown;
    channel?: {
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    condition?: {
      conditionId?: number | string;
      decision?: object | null;
      description?: string | null;
      destinationAccountId?: string | null;
      name: string;
      notes?: string | null;
      operationEndDate?: Date | null;
      operationStartDate?: Date | null;
      priority?: number | null;
      sourceAccountId?: string | null;
    };
    destination?: {
      accountFeePolicy?: (number | string)[] | null;
      accountProduct?: (number | string)[] | null;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      cardProduct?: (number | string)[] | null;
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      customerType?: (number | string)[] | null;
      kyc?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    limit?: ({
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      amountType?: any | null | 1 | 2;
      conditionId?: number | string;
      credentials?: number | null;
      currency: string;
      limitId?: number | string;
      maxAmount?: number | null;
      maxAmountDaily?: number | null;
      maxAmountMonthly?: number | null;
      maxAmountWeekly?: number | null;
      maxCountDaily?: number | string;
      maxCountMonthly?: number | string;
      maxCountWeekly?: number | string;
      minAmount?: number | null;
      priority?: number | null;
    })[];
    operation?: {
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      tag?: string | null | '';
      transferTag?: string | null | '';
      type?: any[] | null;
    };
    rate?: ({
      conditionId?: number | string;
      rate: number;
      rateId?: number | string;
      startAmount?: number | null;
      startAmountCurrency: string;
      startAmountDaily?: number | null;
      startAmountMonthly?: number | null;
      startAmountWeekly?: number | null;
      startCountDaily?: number | string;
      startCountMonthly?: number | string;
      startCountWeekly?: number | string;
      targetCurrency: string;
    })[];
    source?: {
      accountFeePolicy?: (number | string)[] | null;
      accountProduct?: (number | string)[] | null;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      cardProduct?: (number | string)[] | null;
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      customerType?: (number | string)[] | null;
      kyc?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    splitAnalytic?: ({
      name?: string | null;
      splitAnalyticId: number;
      splitAssignmentId: number;
      value?: string | null;
    })[];
    splitAssignment?: ({
      credit: string;
      debit: string;
      description: string;
      maxValue?: number | null;
      minValue?: number | null;
      percent?: number | null;
      quantity?: string | null;
      splitAssignmentId: number;
      splitNameId: number;
    })[];
    splitName?: ({
      amountType?: any | null | 1 | 2;
      conditionId: number | string;
      name: string;
      splitNameId: number;
      tag?: string[];
    })[];
    splitRange?: ({
      isSourceAmount?: true | false | 0 | 1 | '0' | '1' | null;
      maxValue?: number | null;
      minValue?: number | null;
      percent?: number | null;
      percentBase?: number | null;
      splitNameId: number;
      splitRangeId: number;
      startAmount: number;
      startAmountCurrency: string;
      startAmountDaily: number;
      startAmountMonthly: number;
      startAmountWeekly: number;
      startCountDaily: number | string;
      startCountMonthly: number | string;
      startCountWeekly: number | string;
    })[];
  }
  export interface result {
    /**
     * Unknown Property
     */
    [x: string]: unknown;
    channel?: {
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    condition?: {
      conditionId?: number | string;
      decision?: object | null;
      description?: string | null;
      destinationAccountId?: string | null;
      name: string;
      notes?: string | null;
      operationEndDate?: Date | null;
      operationStartDate?: Date | null;
      priority?: number | null;
      sourceAccountId?: string | null;
    };
    destination?: {
      accountFeePolicy?: (number | string)[] | null;
      accountProduct?: (number | string)[] | null;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      cardProduct?: (number | string)[] | null;
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      customerType?: (number | string)[] | null;
      kyc?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    limit?: ({
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      amountType?: any | null | 1 | 2;
      conditionId?: number | string;
      credentials?: number | null;
      currency: string;
      limitId?: number | string;
      maxAmount?: number | null;
      maxAmountDaily?: number | null;
      maxAmountMonthly?: number | null;
      maxAmountWeekly?: number | null;
      maxCountDaily?: number | string;
      maxCountMonthly?: number | string;
      maxCountWeekly?: number | string;
      minAmount?: number | null;
      priority?: number | null;
    })[];
    operation?: {
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      tag?: string | null | '';
      transferTag?: string | null | '';
      type?: any[] | null;
    };
    rate?: ({
      conditionId?: number | string;
      rate: number;
      rateId?: number | string;
      startAmount?: number | null;
      startAmountCurrency: string;
      startAmountDaily?: number | null;
      startAmountMonthly?: number | null;
      startAmountWeekly?: number | null;
      startCountDaily?: number | string;
      startCountMonthly?: number | string;
      startCountWeekly?: number | string;
      targetCurrency: string;
    })[];
    source?: {
      accountFeePolicy?: (number | string)[] | null;
      accountProduct?: (number | string)[] | null;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      cardProduct?: (number | string)[] | null;
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      customerType?: (number | string)[] | null;
      kyc?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    splitAnalytic?: ({
      name?: string | null;
      splitAnalyticId: number;
      splitAssignmentId: number;
      value?: string | null;
    })[];
    splitAssignment?: ({
      credit: string;
      debit: string;
      description: string;
      maxValue?: number | null;
      minValue?: number | null;
      percent?: number | null;
      quantity?: string | null;
      splitAssignmentId: number;
      splitNameId: number;
    })[];
    splitName?: ({
      amountType?: any | null | 1 | 2;
      conditionId: number | string;
      name: string;
      splitNameId: number;
      tag?: string[];
    })[];
    splitRange?: ({
      isSourceAmount?: true | false | 0 | 1 | '0' | '1' | null;
      maxValue?: number | null;
      minValue?: number | null;
      percent?: number | null;
      percentBase?: number | null;
      splitNameId: number;
      splitRangeId: number;
      startAmount: number;
      startAmountCurrency: string;
      startAmountDaily: number;
      startAmountMonthly: number;
      startAmountWeekly: number;
      startCountDaily: number | string;
      startCountMonthly: number | string;
      startCountWeekly: number | string;
    })[];
  }
}

declare namespace rule_condition_fetch {
  export type params = any;
  export type result = any;
}

declare namespace rule_condition_get {
  export interface params {
    conditionId: number | string;
  }
  export interface result {
    /**
     * Unknown Property
     */
    [x: string]: unknown;
    channel?: {
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    condition?: {
      conditionId?: number | string;
      decision?: object | null;
      description?: string | null;
      destinationAccountId?: string | null;
      name: string;
      notes?: string | null;
      operationEndDate?: Date | null;
      operationStartDate?: Date | null;
      priority?: number | null;
      sourceAccountId?: string | null;
    };
    destination?: {
      accountFeePolicy?: (number | string)[] | null;
      accountProduct?: (number | string)[] | null;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      cardProduct?: (number | string)[] | null;
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      customerType?: (number | string)[] | null;
      kyc?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    limit?: ({
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      amountType?: any | null | 1 | 2;
      conditionId?: number | string;
      credentials?: number | null;
      currency: string;
      limitId?: number | string;
      maxAmount?: number | null;
      maxAmountDaily?: number | null;
      maxAmountMonthly?: number | null;
      maxAmountWeekly?: number | null;
      maxCountDaily?: number | string;
      maxCountMonthly?: number | string;
      maxCountWeekly?: number | string;
      minAmount?: number | null;
      priority?: number | null;
    })[];
    operation?: {
      /**
       * Unknown Property
       */
      [x: string]: unknown;
      tag?: string | null | '';
      transferTag?: string | null | '';
      type?: any[] | null;
    };
    rate?: ({
      conditionId?: number | string;
      rate: number;
      rateId?: number | string;
      startAmount?: number | null;
      startAmountCurrency: string;
      startAmountDaily?: number | null;
      startAmountMonthly?: number | null;
      startAmountWeekly?: number | null;
      startCountDaily?: number | string;
      startCountMonthly?: number | string;
      startCountWeekly?: number | string;
      targetCurrency: string;
    })[];
    source?: {
      accountFeePolicy?: (number | string)[] | null;
      accountProduct?: (number | string)[] | null;
      actor?: (number | string)[] | null;
      actorTag?: string | null | '';
      cardProduct?: (number | string)[] | null;
      city?: (number | string)[] | null;
      country?: (number | string)[] | null;
      customerType?: (number | string)[] | null;
      kyc?: (number | string)[] | null;
      region?: (number | string)[] | null;
    };
    splitAnalytic?: ({
      name?: string | null;
      splitAnalyticId: number;
      splitAssignmentId: number;
      value?: string | null;
    })[];
    splitAssignment?: ({
      credit: string;
      debit: string;
      description: string;
      maxValue?: number | null;
      minValue?: number | null;
      percent?: number | null;
      quantity?: string | null;
      splitAssignmentId: number;
      splitNameId: number;
    })[];
    splitName?: ({
      amountType?: any | null | 1 | 2;
      conditionId: number | string;
      name: string;
      splitNameId: number;
      tag?: string[];
    })[];
    splitRange?: ({
      isSourceAmount?: true | false | 0 | 1 | '0' | '1' | null;
      maxValue?: number | null;
      minValue?: number | null;
      percent?: number | null;
      percentBase?: number | null;
      splitNameId: number;
      splitRangeId: number;
      startAmount: number;
      startAmountCurrency: string;
      startAmountDaily: number;
      startAmountMonthly: number;
      startAmountWeekly: number;
      startCountDaily: number | string;
      startCountMonthly: number | string;
      startCountWeekly: number | string;
    })[];
  }
}

declare namespace rule_decision_fetch {
  export interface params {
    /**
     * Unknown Property
     */
    [x: string]: unknown;
    amountString: string;
    channelCityId?: number | null;
    channelCountryId?: number | null;
    channelId?: number | null;
    channelOrganizationId?: number | null;
    channelRegionId?: number | null;
    channelRoleId?: number | null;
    channelSupervisorId?: number | null;
    channelTags?: string;
    currency: string;
    destinationAccountId?: number | null;
    destinationCityId?: number | null;
    destinationCountryId?: number | null;
    destinationId?: number | null;
    destinationOrganizationId?: number | null;
    destinationProductId?: number | null;
    destinationRegionId?: number | null;
    destinationSupervisorId?: number | null;
    destinationTags?: string;
    isSourceAmount?: 0 | 1 | '0' | '1';
    operationDate?: Date;
    operationId?: number | null;
    operationTags?: string;
    sourceAccountId?: number | null;
    sourceCityId?: number | null;
    sourceCountryId?: number | null;
    sourceId?: number | null;
    sourceOrganizationId?: number | null;
    sourceProductId?: number | null;
    sourceRegionId?: number | null;
    sourceSupervisorId?: number | null;
    sourceTags?: string;
  }
  export interface result {
    commission?: {
      amount?: number;
    } | null;
    fee?: {
      amount?: number;
    } | null;
    limit?: {
      count?: number | null;
      maxAmount?: number | null;
      minAmount?: number | null;
    } | null;
  }
}

declare namespace rule_decision_lookup {
  export interface params {
    accountAmount?: string;
    accountCurrency?: string;
    amount: string;
    channelId?: number | null;
    currency: string;
    destinationAccount: string;
    isSourceAmount?: 0 | 1 | '0' | '1';
    operation: string;
    operationDate?: Date;
    settlementAmount?: string;
    settlementCurrency?: string;
    sourceAccount: string;
    sourceCardProductId?: number | null;
    transferProperties?: object;
  }
  export interface result {
    amount?: {
      accountAmount?: string | null;
      accountCurrency?: string;
      accountRate?: number | null;
      accountRateConditionName?: string | null;
      accountRateId?: number | null;
      acquirerFee?: string | null;
      cashback?: string | null;
      commission?: string | null;
      issuerFee?: string | null;
      processorFee?: string | null;
      settlementAmount?: string | null;
      settlementCurrency?: string;
      settlementRate?: number | null;
      settlementRateConditionName?: string | null;
      settlementRateId?: number | null;
      transferDateTime: Date;
      transferFee?: string | null;
      transferTypeId: string;
    };
    decision?: object | null;
    rule?: object | null;
    split?: ({
      amount: string;
      analytics?: object | null;
      conditionId: number;
      conditionName: string;
      credit: string;
      currency: string;
      debit: string;
      description?: string | null;
      quantity?: string | null;
      splitNameId: number;
      tag: string | null;
    })[];
  }
}

declare namespace rule_dropdown_list {
  export interface params {}
  export interface result {
    'rule.accountProduct'?: ({
      alias?: string | null | '';
      description?: string | null | '';
      label: string;
      parent?: number | string;
      value: number | string;
    })[];
    'rule.cardProduct'?: ({
      alias?: string | null | '';
      description?: string | null | '';
      label: string;
      parent?: number | string;
      value: number | string;
    })[];
    'rule.channel'?: ({
      alias?: string | null | '';
      description?: string | null | '';
      label: string;
      parent?: number | string;
      value: number | string;
    })[];
    'rule.city'?: ({
      alias?: string | null | '';
      description?: string | null | '';
      label: string;
      parent?: number | string;
      value: number | string;
    })[];
    'rule.country'?: ({
      alias?: string | null | '';
      description?: string | null | '';
      label: string;
      parent?: number | string;
      value: number | string;
    })[];
    'rule.currency'?: ({
      alias?: string | null | '';
      description?: string | null | '';
      label: string;
      parent?: number | string;
      value: number | string;
    })[];
    'rule.customerType'?: ({
      alias?: string | null | '';
      description?: string | null | '';
      label: string;
      parent?: number | string;
      value: number | string;
    })[];
    'rule.kyc'?: ({
      alias?: string | null | '';
      description?: string | null | '';
      label: string;
      parent?: number | string;
      value: number | string;
    })[];
    'rule.operation'?: ({
      alias?: string | null | '';
      description?: string | null | '';
      label: string;
      parent?: number | string;
      value: number | string;
    })[];
    'rule.region'?: ({
      alias?: string | null | '';
      description?: string | null | '';
      label: string;
      parent?: number | string;
      value: number | string;
    })[];
    'rule.role'?: ({
      alias?: string | null | '';
      description?: string | null | '';
      label: string;
      parent?: number | string;
      value: number | string;
    })[];
  }
}

declare namespace rule_item_fetch {
  export type params = any;
  export type result = any;
}

declare namespace rule_limitForUserByRole_get {
  export interface params {
    approvedAmount?: number;
    currency?: string;
    nextLevel?: boolean;
    operation?: string;
    property?: string;
    userId: number;
  }
  export type result = any;
}

declare namespace rule_rule_add {
  export type params = any;
  export type result = any;
}

declare namespace rule_rule_edit {
  export type params = any;
  export type result = any;
}

declare namespace rule_rule_fetch {
  export type params = any;
  export type result = any;
}

declare namespace rule_rule_fetchDeleted {
  export type params = any;
  export type result = any;
}

declare namespace rule_rule_remove {
  export type params = any;
  export type result = any;
}

import ut from 'ut-run';
export interface ports<location = ''> {

}
interface methods extends ports {}

export interface handlers<location = ''> {
  'rule.condition.add'?: ut.handler<rule_condition_add.params, rule_condition_add.result, location>,
  ruleConditionAdd?: ut.handler<rule_condition_add.params, rule_condition_add.result, location>,
  'rule.condition.edit'?: ut.handler<rule_condition_edit.params, rule_condition_edit.result, location>,
  ruleConditionEdit?: ut.handler<rule_condition_edit.params, rule_condition_edit.result, location>,
  'rule.condition.fetch'?: ut.handler<rule_condition_fetch.params, rule_condition_fetch.result, location>,
  ruleConditionFetch?: ut.handler<rule_condition_fetch.params, rule_condition_fetch.result, location>,
  'rule.condition.get'?: ut.handler<rule_condition_get.params, rule_condition_get.result, location>,
  ruleConditionGet?: ut.handler<rule_condition_get.params, rule_condition_get.result, location>,
  'rule.decision.fetch'?: ut.handler<rule_decision_fetch.params, rule_decision_fetch.result, location>,
  ruleDecisionFetch?: ut.handler<rule_decision_fetch.params, rule_decision_fetch.result, location>,
  'rule.decision.lookup'?: ut.handler<rule_decision_lookup.params, rule_decision_lookup.result, location>,
  ruleDecisionLookup?: ut.handler<rule_decision_lookup.params, rule_decision_lookup.result, location>,
  'rule.dropdown.list'?: ut.handler<rule_dropdown_list.params, rule_dropdown_list.result, location>,
  ruleDropdownList?: ut.handler<rule_dropdown_list.params, rule_dropdown_list.result, location>,
  'rule.item.fetch'?: ut.handler<rule_item_fetch.params, rule_item_fetch.result, location>,
  ruleItemFetch?: ut.handler<rule_item_fetch.params, rule_item_fetch.result, location>,
  'rule.limitForUserByRole.get'?: ut.handler<rule_limitForUserByRole_get.params, rule_limitForUserByRole_get.result, location>,
  'rule.rule.add'?: ut.handler<rule_rule_add.params, rule_rule_add.result, location>,
  ruleRuleAdd?: ut.handler<rule_rule_add.params, rule_rule_add.result, location>,
  'rule.rule.edit'?: ut.handler<rule_rule_edit.params, rule_rule_edit.result, location>,
  ruleRuleEdit?: ut.handler<rule_rule_edit.params, rule_rule_edit.result, location>,
  'rule.rule.fetch'?: ut.handler<rule_rule_fetch.params, rule_rule_fetch.result, location>,
  ruleRuleFetch?: ut.handler<rule_rule_fetch.params, rule_rule_fetch.result, location>,
  'rule.rule.fetchDeleted'?: ut.handler<rule_rule_fetchDeleted.params, rule_rule_fetchDeleted.result, location>,
  ruleRuleFetchDeleted?: ut.handler<rule_rule_fetchDeleted.params, rule_rule_fetchDeleted.result, location>,
  'rule.rule.remove'?: ut.handler<rule_rule_remove.params, rule_rule_remove.result, location>,
  ruleRuleRemove?: ut.handler<rule_rule_remove.params, rule_rule_remove.result, location>
}

export interface errors {
  'error.rule': ut.error,
  'error.rule.amount': ut.error,
  errorRuleAmount: ut.error,
  'error.rule.duplicatedName': ut.error,
  errorRuleDuplicatedName: ut.error,
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

import login, {loginTableTypes} from 'ut-login/handlers'
interface methods extends login.handlers {}

import core, {coreTableTypes} from 'ut-core/handlers'
interface methods extends core.handlers {}

import customer, {customerTableTypes} from 'ut-customer/handlers'
interface methods extends customer.handlers {}

export type libFactory = ut.libFactory<methods, errors>
export type handlerFactory = ut.handlerFactory<methods, errors, handlers<'local'>>
export type handlerSet = ut.handlerSet<methods, errors, handlers<'local'>>
export type test = ut.test<methods & handlers>
export type steps = ut.steps<methods & handlers>

import portal from 'ut-portal'
export type pageFactory = portal.pageFactory<methods, errors>
export type pageSet = portal.pageSet<methods, errors>
