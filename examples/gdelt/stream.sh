#!/usr/bin/env bash

HOST_IP=$(ifconfig | grep 'inet \(192..........\)' -o |  grep '192..........' -o)
echo 'master ip:' ${HOST_IP}
cat GDELT.dat | node throttle.js 1000 | bach task-run --ip ${HOST_IP} -m 4 > out
#cat GDELT.dat | bach task-run --ip ${HOST_IP} -m 2 > out
