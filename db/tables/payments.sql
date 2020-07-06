CREATE TABLE payments
(
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	"customerId" uuid NOT NULL,
	"operationId" varchar NOT NULL,
	amount decimal CHECK (amount > 0) NOT NULL,
	status paymentStatus NOT NULL,
	"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY ("customerId") REFERENCES customers (id) ON DELETE RESTRICT
)