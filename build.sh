#!/bin/bash
cd /home/ec2-user/GSS-Backend
docker build . -t gss_api
docker stop gss_api
docker rm gss_api
docker run -d --network gss_network --link gss_mariadb:db --name gss_api gss_api
OUTPUT=$(docker images --filter "dangling=true" -q --no-trunc | wc -l)
if [ ${OUTPUT} != 0 ];
then    
    docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
fi