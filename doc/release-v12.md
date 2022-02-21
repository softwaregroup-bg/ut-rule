# ut-rule version 12 release notes

## Breaking Changes

- Changed datetime values in DB to use UTC
- When editing rules, the times reported to ut-notice and ut-audit will be in UTC

## Upgrade Steps

- Make sure you upgrade ut-transfer to ^8.0.0 and read the release notes
  for that version.
- Make sure to set utRule.sql.utc=true in the configuration to indicate that
  you are aware of the implications of the breaking changes in ut-rule and
  ut-transfer.
- Do not upgrade to this version if you are not sure what needs to be
  done in the database.

## Full change set

[https://github.com/softwaregroup-bg/ut-rule/compare/v11.5.1...v12.0.0](https://github.com/softwaregroup-bg/ut-rule/compare/v11.5.1...v12.0.0)
