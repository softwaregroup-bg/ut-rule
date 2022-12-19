CREATE VIEW [rule].vCustomerType AS
SELECT
    [customerTypeNumber] [value],
    [description] [label]
FROM
    customer.customerType
