#!/usr/bin/env bash

HOST_IP=$(ifconfig | grep 'inet \(192..........\)' -o |  grep '192..........' -o)
echo 'master ip:' ${HOST_IP}
cat GDELT1MIL.dat | node throttle.js 100 | bach task-run --ip ${HOST_IP} -p 1 > out
