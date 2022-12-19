CREATE VIEW [rule].vKyc AS
SELECT
    k.kycId [value],
    k.display + ' - ' + t.label + ' - ' + o.organizationName label,
    o.actorId parent
FROM
    customer.kyc k
JOIN
    customer.organization o ON o.actorId = k.organizationId
JOIN
    [rule].vCustomerType t ON t.value = k.customerTypeId
