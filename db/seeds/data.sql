BEGIN TRANSACTION;

WITH new_customer AS
(
	INSERT INTO customers(msisdn, status)
	VALUES('+375291111111', 'Active')
	RETURNING id AS customer_id
), new_payments AS
(
	INSERT INTO payments("customerId", "operationId", amount, status)
	SELECT customer_id, 'test operation id', 10.5, 'Success' FROM new_customer
)
INSERT INTO balances("customerId", sum, "updatedAt")
SELECT customer_id, 10.5, NOW() FROM new_customer;

INSERT INTO settings(key, value)
VALUES('customersWhoCanMakePayments', 'Active');

COMMIT;