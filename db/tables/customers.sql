CREATE TABLE customers
(
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	msisdn varchar UNIQUE NOT NULL,
	status customerStatus NOT NULL,
	"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
)