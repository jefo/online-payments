-- Deploy fresh database extensions
\i '/docker-entrypoint-initdb.d/extensions/uuid-ossp.sql'

-- Deploy fresh database types
\i '/docker-entrypoint-initdb.d/types/customer-status.sql'
\i '/docker-entrypoint-initdb.d/types/payment-status.sql'

-- Deploy fresh database tables
\i '/docker-entrypoint-initdb.d/tables/customers.sql'
\i '/docker-entrypoint-initdb.d/tables/payments.sql'
\i '/docker-entrypoint-initdb.d/tables/balances.sql'
\i '/docker-entrypoint-initdb.d/tables/settings.sql'

-- For testing purposes only. This file will add dummy data
\i '/docker-entrypoint-initdb.d/seeds/data.sql'
