#!/bin/bash
DATE=`date +"%d_%b_%Y_%H%M"`
SQLFILE=/home/dailyMysqlBackup/gss_${DATE}.sql
DATABASE=GSS
USER=root
PASSWORD=Bleach@123
HOST=172.17.0.2
rm gss_*
mysqldump --column-statistics=0  -h ${HOST} -u ${USER} -p${PASSWORD} ${DATABASE}|gzip > ${SQLFILE}.gz
aws s3 cp ${SQLFILE}.gz s3://gssmysqlbackup/mysql-backup/