#!/usr/bin/env bash

HOST_IP=$(ifconfig | grep 'inet \(192..........\)' -o |  grep '192..........' -o)
cat GDELT1MIL.dat | bach task-run --ip ${HOST_IP} -p 1
