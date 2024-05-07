#!/bin/bash
## Load environment variables and deploy to the docker swarm.
##
## Usages:
##   ./deploy-swarm prepare
##
set -eo pipefail
set -vx
. ./scripts/deploy-stack.sh
load_env

if [ "$1" == "destroy" ]
then
    echo "This will remove everything in your stack including volumes"
    echo "Are you Sure? (Y/N)"
    read user_input
    if ! ( [ "$user_input" = "y" ] || [ "$user_input" = "Y" ])
    then
        exit 1
    fi
    echo "Proceeding..."    # Delete the Docker stack if "destroy" argument is provided
    docker stack rm "${STACK_NAME}-services" || echo  "${STACK_NAME}-services doesn't exist"
    docker stack rm ${STACK_NAME} || echo  "${STACK_NAME} doesn't exist"
    ./gen-configs.sh clean

    for VOLUME in $(docker volume ls --filter "label=com.docker.stack.namespace=${STACK_NAME}" -q) "${STACK_NAME}-services_postgres"
    do
        echo -n "Removing Volume : "
        docker volume rm "$VOLUME"
    done

elif [ "$1" == "prepare" ]
then
    ## apply the enviroment to services compose file
    ## and deploy the stack
    deploy-stack ${STACK_NAME}-services './docker-compose-services.yml'

elif [ "$1" == "finalize" ]
then
    ## apply the environment to compose file
    ## deploy the govtool test infrastructure stack
    deploy-stack ${STACK_NAME}-base  './docker-compose.yml'
elif [ "$1" == 'stack' ]
then
   if [ "$#" -ne 2 ]
   then
     echo 'stack requires the stack name "govtool" | "services" | "test"'
  else
     case "$2" in
       govtool)
         deploy-stack ${STACK_NAME}  './docker-compose.yml'
         ;;
       services)
         deploy-stack ${STACK_NAME}-services  './docker-compose.yml'
         ;;
       base)
         deploy-stack ${STACK_NAME}-base  './docker-compose.yml'
         ;;
       *)
         echo 'Invalid stack name. Valid options are "base", "services", or "govtool"'
         ;;
     esac
  fi
else
    echo "Something is wrong with the command"
    echo
    echo "  Usage:"
    echo "    $0 (prepare | destroy | finalize | deploy)"
    echo ''
    echo "  Options:"
    echo "    prepare  -> deploys the services required by the test stack. i.e 'postgres' and 'reverse-proxy'"
    echo "    finalize -> deploys the test infrastructure services"
    echo "    destroy  -> teardown everything except the volumes"
    echo "    deploy  [stack_name] -> Deploy the stack."
fi
