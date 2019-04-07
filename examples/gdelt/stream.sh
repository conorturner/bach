#!/usr/bin/env bash

HOST_IP=$(ifconfig | grep 'inet \(192..........\)' -o |  grep '192..........' -o)
echo 'master ip:' ${HOST_IP}
cat GDELT1MIL.dat | bach task-run --ip ${HOST_IP} -p 1
