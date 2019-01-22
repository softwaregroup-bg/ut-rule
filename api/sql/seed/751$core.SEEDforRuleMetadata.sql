DECLARE @dataModel XML
SET @dataModel =
    '<object name = "rule" type = "businessObject" mainTableSchema = "rule" mainTableName = "condition" >
    <components>
    <component name = "get">
    <variables>
        <variable name = "@objectId" isSPParam = "1" definition = "BIGINT"/> 
        <variable name = "@eventDate" isSPParam = "1" definition = "DATETIME2(3)"/>
       
    </variables>
    <subObjects>
        <subObject name = "condition" isSingle = "0">
        <relations>
            <relation schemaName = "rule" tableName = "condition" tableAlias = "rc" joinType = "FROM" joinOrder = "1">
            <fields>
                <field sourceColumn = "conditionId" fieldOrder="1"/>
                <field sourceColumn = "priority" fieldOrder="2"/>
                <field sourceColumn = "operationEndDate" fieldOrder="3"/>
                <field sourceColumn = "operationStartDate" fieldOrder="4"/>
                <field sourceColumn = "sourceAccountId" fieldOrder="5"/>
                <field sourceColumn = "destinationAccountId" fieldOrder="6"/>
            </fields>
            <conditions>
                <condition columnName = "conditionId" definition = " = @objectId" />
            </conditions>
            </relation>
        </relations>
        </subObject>
    <subObject name = "conditionItem" isSingle = "0" >
        <relations>
        <relation schemaName = "rule" tableName = "conditionItem" tableAlias = "ci" joinType = "FROM" joinOrder = "1">
            <fields>
                <field sourceColumn = "conditionId" fieldOrder="1"/>
                <field sourceColumn = "factor" fieldOrder="2"/>
            </fields>
            <conditions>
            <condition columnName = "conditionId" definition = " = @objectId" />
            </conditions>
        </relation> 
        <relation schemaName = "rule" tableName = "condition" tableAlias = "rc" columnName = "conditionId" parentRelationAlias = "ci" parentColumn = "conditionId" joinType = "JOIN" joinOrder = "2" additionalConditions="">
        </relation>
        <relation schemaName = "core" tableName = "itemName" tableAlias = "cn" columnName = "itemNameId" parentRelationAlias = "ci" parentColumn = "itemNameId" joinType = "JOIN" joinOrder = "3" additionalConditions="">
            <fields>
                <field sourceColumn = "itemName" fieldOrder="3"/>
            </fields>
        </relation>
        <relation schemaName = "core" tableName = "itemType" tableAlias = "ct" columnName = "itemTypeId" parentRelationAlias = "cn" parentColumn = "itemTypeId" joinType = "JOIN" joinOrder = "4" additionalConditions="">
            <fields>
                <field sourceColumn = "name" columnAlias = "itemTypeName" fieldOrder="4"/>
                <field sourceColumn = "alias" columnAlias = "type" fieldOrder="5"/>
            </fields>
        </relation>
        </relations>
    </subObject>
    <subObject name = "conditionProperty" isSingle = "0" >
        <relations>
        <relation schemaName = "rule" tableName = "conditionProperty" tableAlias = "cp" joinType = "FROM" joinOrder = "1" >
            <fields>
                <field sourceColumn = "conditionId" fieldOrder="1"/>
                <field sourceColumn = "factor" fieldOrder="2"/>
                <field sourceColumn = "name" fieldOrder="3"/>
                <field sourceColumn = "value" fieldOrder="4"/>
            </fields>
            <conditions>
            <condition columnName = "conditionId" definition = " = @objectId" />
            </conditions>
        </relation>
        <relation schemaName = "rule" tableName = "condition" tableAlias = "rc" columnName = "conditionId" parentRelationAlias = "cp" parentColumn = "conditionId" joinType = "JOIN" joinOrder = "2" additionalConditions="">
        </relation>
        </relations>
    </subObject>
    <subObject name = "conditionActor" isSingle = "0" >
        <relations>
        <relation schemaName = "rule" tableName = "conditionActor" tableAlias = "ca" joinType = "FROM" joinOrder = "1">
            <fields>
            <field sourceColumn = "conditionId" fieldOrder="1" />
            <field sourceColumn = "factor" fieldOrder="2" />
            <field sourceColumn = "actorId" fieldOrder="3" />
            </fields>
            <conditions>
            <condition columnName = "conditionId" definition = " = @objectId" />
            </conditions>
        </relation>
        <relation schemaName = "rule" tableName = "condition" tableAlias = "rc" columnName = "conditionId" parentRelationAlias = "ca" parentColumn = "conditionId" joinType = "JOIN" joinOrder = "2" additionalConditions="">
        </relation>
        <relation schemaName = "core" tableName = "actor" tableAlias = "aa" columnName = "actorId" parentRelationAlias = "ca" parentColumn = "actorId" joinType = "JOIN" joinOrder = "3" additionalConditions="">
            <fields>
            <field sourceColumn = "actorType" columnAlias="type" fieldOrder="4" />
            </fields>
        </relation>
        <relation schemaName = "customer" tableName = "organization" tableAlias = "co" columnName = "actorId" parentRelationAlias = "ca" parentColumn = "actorId" joinType = "JOIN" joinOrder = "4" additionalConditions="">
            <fields>
            <field sourceColumn = "organizationName" fieldOrder="5" />
            </fields>
        </relation>
        </relations>
    </subObject>
   <subObject name = "limit" isSingle = "0" >
        <relations>
        <relation schemaName = "rule" tableName = "limit" tableAlias = "rl" joinType = "FROM" joinOrder = "1">
            <fields>
                <field sourceColumn = "conditionId" fieldOrder="1"/>
                <field sourceColumn = "credentials" fieldOrder="2"/>
                <field sourceColumn = "currency" fieldOrder="3"/>
                <field sourceColumn = "limitId" fieldOrder="4"/>
                <field sourceColumn = "maxAmount" fieldOrder="5"/>
                <field sourceColumn = "maxAmountDaily" fieldOrder="6"/>
                <field sourceColumn = "maxAmountMonthly" fieldOrder="7"/>
                <field sourceColumn = "maxAmountWeekly" fieldOrder="8"/>
                <field sourceColumn = "maxCountDaily" fieldOrder="9"/>
                <field sourceColumn = "maxCountMonthly" fieldOrder="10"/>
                <field sourceColumn = "maxCountWeekly" fieldOrder="11"/>
                <field sourceColumn = "minAmount" fieldOrder="12"/>
                <field sourceColumn = "priority" fieldOrder="13"/>
            </fields>
            <conditions>
            <condition columnName = "conditionId" definition = " = @objectId" />
            </conditions>
        </relation> 
        <relation schemaName = "rule" tableName = "condition" tableAlias = "rc" columnName = "conditionId" parentRelationAlias = "rl" parentColumn = "conditionId" joinType = "JOIN" joinOrder = "2" additionalConditions="">
        </relation>
        </relations>
    </subObject>
    <subObject name = "splitName" isSingle = "0" >
        <relations>
        <relation schemaName = "rule" tableName = "splitName" tableAlias = "sn" joinType = "FROM" joinOrder = "1">
            <fields>
                <field sourceColumn = "splitNameId" fieldOrder="1"/>
                <field sourceColumn = "conditionId" fieldOrder="2"/>
                <field sourceColumn = "name" fieldOrder="3"/>
                <field sourceColumn = "tag" fieldOrder="4"/>
            </fields>
            <conditions>
            <condition columnName = "conditionId" definition = " = @objectId" />
            </conditions>
        </relation> 
        <relation schemaName = "rule" tableName = "condition" tableAlias = "rc" columnName = "conditionId" parentRelationAlias = "sn" parentColumn = "conditionId" joinType = "JOIN" joinOrder = "2" additionalConditions="">
        </relation>
        </relations>
    </subObject>
    <subObject name = "splitRange" isSingle = "0" >
        <relations>
        <relation schemaName = "rule" tableName = "splitRange" tableAlias = "sr" joinType = "FROM" joinOrder = "1">
            <fields>
                <field sourceColumn = "splitNameId" fieldOrder="1"/>
                <field sourceColumn = "startAmount" fieldOrder="2"/>
                <field sourceColumn = "startAmountCurrency" fieldOrder="3"/>
                <field sourceColumn = "startAmountDaily" fieldOrder="4"/>
                <field sourceColumn = "startCountDaily" fieldOrder="5"/>
                <field sourceColumn = "startAmountWeekly" fieldOrder="6"/>
                <field sourceColumn = "startCountWeekly" fieldOrder="7"/>
                <field sourceColumn = "startAmountMonthly" fieldOrder="8"/>
                <field sourceColumn = "startCountMonthly" fieldOrder="9"/>
                <field sourceColumn = "isSourceAmount" fieldOrder="10"/>
                <field sourceColumn = "minValue" fieldOrder="11"/>
                <field sourceColumn = "maxValue" fieldOrder="12"/>
                <field sourceColumn = "[percent]" fieldOrder="13"/>
            </fields>
        </relation> 
        <relation schemaName = "rule" tableName = "splitName" tableAlias = "sn" columnName = "splitNameId" parentRelationAlias = "sr" parentColumn = "splitNameId" joinType = "JOIN" joinOrder = "2" additionalConditions="">
            <conditions>
            <condition columnName = "conditionId" definition = " = @objectId" />
            </conditions>
        </relation> 
        <relation schemaName = "rule" tableName = "condition" tableAlias = "rc" columnName = "conditionId" parentRelationAlias = "sn" parentColumn = "conditionId" joinType = "JOIN" joinOrder = "3" additionalConditions="">
        </relation>
        </relations>
    </subObject>
    <subObject name = "splitAssignment" isSingle = "0" >
        <relations>
        <relation schemaName = "rule" tableName = "splitAssignment" tableAlias = "sa" joinType = "FROM" joinOrder = "1">
            <fields>
                <field sourceColumn = "splitAssignmentId" fieldOrder="1"/>
                <field sourceColumn = "splitNameId" fieldOrder="2"/>
                <field sourceColumn = "debit" fieldOrder="3"/>
                <field sourceColumn = "credit" fieldOrder="4"/>
                <field sourceColumn = "minValue" fieldOrder="5"/>
                <field sourceColumn = "maxValue" fieldOrder="6"/>
                <field sourceColumn = "description" fieldOrder="7"/>
                <field sourceColumn = "[percent]" fieldOrder="8"/>
            </fields>
        </relation> 
        <relation schemaName = "rule" tableName = "splitName" tableAlias = "sn" columnName = "splitNameId" parentRelationAlias = "sa" parentColumn = "splitNameId" joinType = "JOIN" joinOrder = "2" additionalConditions="">
            <conditions>
            <condition columnName = "conditionId" definition = " = @objectId" />
            </conditions>
        </relation>
        <relation schemaName = "rule" tableName = "condition" tableAlias = "rc" columnName = "conditionId" parentRelationAlias = "sn" parentColumn = "conditionId" joinType = "JOIN" joinOrder = "3" additionalConditions="">
        </relation>
        </relations>
    </subObject>
    <subObject name = "splitAnalytic" isSingle = "0" >
        <relations>
        <relation schemaName = "rule" tableName = "splitAnalytic" tableAlias = "san" joinType = "FROM" joinOrder = "1">
            <fields>
                <field sourceColumn = "splitAnalyticId" fieldOrder="1"/>
                <field sourceColumn = "splitAssignmentId" fieldOrder="2"/>
                <field sourceColumn = "name" fieldOrder="3"/>
                <field sourceColumn = "value" fieldOrder="4"/>
            </fields>
        </relation>
        <relation schemaName = "rule" tableName = "splitAssignment" tableAlias = "sa" columnName = "splitAssignmentId" parentRelationAlias = "san" parentColumn = "splitAssignmentId" joinType = "JOIN" joinOrder = "2" additionalConditions="">
        </relation>
        <relation schemaName = "rule" tableName = "splitName" tableAlias = "sn" columnName = "splitNameId" parentRelationAlias = "sa" parentColumn = "splitNameId" joinType = "JOIN" joinOrder = "3" additionalConditions="">
            <conditions>
            <condition columnName = "conditionId" definition = " = @objectId" />
            </conditions>
        </relation>
        <relation schemaName = "rule" tableName = "condition" tableAlias = "rc" columnName = "conditionId" parentRelationAlias = "sn" parentColumn = "conditionId" joinType = "JOIN" joinOrder = "4" additionalConditions="">
        </relation>
        </relations>
    </subObject>
    </subObjects>
    </component>
    <component name = "fetch">
    <variables>
        <variable name = "@globalId" isSPParam = "1" definition = "UNIQUEIDENTIFIER"/>
        <variable name = "@eventDate" isSPParam = "1" definition = "DATETIME2(3)"/>
    </variables>
    <subObjects> 
    <subObject name = "ruleFetch" isSingle = "0" >
        <relations>
        <relation schemaName = "rule" tableName = "condition" tableAlias = "rc" joinType = "FROM" joinOrder = "1">
            <fields>
            <field sourceColumn = "conditionId" columnAlias = "objectId" />
            <field sourceColumn = "priority" columnAlias = "shortDesc" />
            </fields>
        </relation>
        </relations>
    </subObject>
    </subObjects>
    </component>
    </components>
    </object>'

DECLARE @RC int
DECLARE @removeDataFlag int = 0
DECLARE @removeDataFlagLeaf int = 1
DECLARE @updateFlag int = 1
DECLARE @insertFlag int = 1
DECLARE @noResultSet INT = 1

-- load object data
EXECUTE @RC = [meta].[dataModelXML.refresh]
    @dataModel,
    @removeDataFlag,
    @removeDataFlagLeaf,
    @updateFlag,
    @insertFlag,
    @noResultSet
