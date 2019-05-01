#!/usr/bin/env bash
HOST_IP=$(ifconfig | grep 'inet \(192..........\)' -o |  grep '192..........' -o)
REMOTE_DOCKER_HOST=strider.local:2375 bach task-run --ip ${HOST_IP} --data https://storage.googleapis.com/public-stuff/GDELT1MIL.dat -p 16
