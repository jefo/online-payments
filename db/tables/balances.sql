CREATE TABLE balances
(
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	"customerId" uuid NOT NULL,
	sum decimal NOT NULL,
	"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp NOT NULL,
	FOREIGN KEY ("customerId") REFERENCES customers (id) ON DELETE RESTRICT
)