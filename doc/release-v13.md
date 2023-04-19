# ut-rule version 13 release notes

## Breaking Changes

- This version requires upgrade of `ut-transfer` and `ut-rule`.
  Existing implementations MUST do a detailed UAT when switching to this release.
- This version expects the view `integration.vAccount` to return an additional column
  `feePolicyId`.

## Upgrade Steps

- Make sure you upgrade ut-transfer to ^9.0.0 and read the release notes
  for that version.

## New Features

- new condition property factor `tp` - transfer properties, which allows for
  arbitrary key-value conditions to be set. Transfer channels now have the
  ability to provide values in the `transferProperties` field. This is useful
  when we want to have different rules for a given operation based on
  transaction details such as merchant location, category, whether the
  transaction is an e-commerce, etc.
- new conditions for source and destination account fee policy
- enable the defining of rules for currency exchange rates
- enable the calculation of amounts in secondary currencies when
  the transfer currency is different from the settlement currency
  or the account currency
- split improvements:
  - `quantity` - specifies how to calculate the split quantity, if any
  - `amount type` - specifies on which amount to base the calculations
    (transfer amount, settlement amount, account amount). The new amounts
    and their currencies can be passed as optional parameters to `rule.decision.lookup`
  - `currency` - previous version did not return information about
    the split currency

## Full change set

[https://github.com/softwaregroup-bg/ut-rule/compare/v12.6.0...v13.0.0](https://github.com/softwaregroup-bg/ut-rule/compare/v12.6.0...v13.0.0)
