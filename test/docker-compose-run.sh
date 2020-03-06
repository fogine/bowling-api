#!/bin/sh

# must be executed in project's root

export POSTGRES_DB=${POSTGRES_DB:-test}
export VHOST=${POSTGRES_DB:-127.0.0.1}
export VHOST_SSL=${VHOST_SSL:-false}
export VHOST_PROTOCOL=${VHOST_PROTOCOL:-http}
export NODE_ENV=test
#important, different project name causes a different set of ephemeral
#containers to be created so  that your local dev containers are not touched
#or deleted
export COMPOSE_PROJECT_NAME=$(basename `pwd`)"-test"

docker-compose run  --rm --name $COMPOSE_PROJECT_NAME web \
    /wait-for-it.sh postgres:5432 -- bash -c 'sqitch deploy db:pg://$POSTGRES_USER@postgres/$POSTGRES_DB && npm run test:int || cat logs/*'

exit_code=$?

docker-compose down -v
exit $exit_code
