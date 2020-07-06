FROM postgres:12.3

ADD /extensions/ /docker-entrypoint-initdb.d/extensions/
ADD /types/ /docker-entrypoint-initdb.d/types/
ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD /seeds/ /docker-entrypoint-initdb.d/seeds/
ADD /deploy_schemas.sql/ /docker-entrypoint-initdb.d/