CREATE VIEW [rule].vConditionOperation AS
SELECT
    cp.conditionId, ip.itemNameId transferTypeId
FROM
    [core].itemProperty ip
JOIN
    [rule].conditionProperty cp ON cp.name = ip.name AND cp.value = ip.value AND cp.factor = 'oc'
UNION
SELECT
    ci.conditionId, ci.itemNameId transferTypeId
FROM
    [rule].conditionItem ci
WHERE
    ci.factor = 'oc'
