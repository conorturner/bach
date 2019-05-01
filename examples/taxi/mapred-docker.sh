#!/usr/bin/env bash
HOST_IP=$(ifconfig | grep 'inet \(192..........\)' -o |  grep '192..........' -o)
bach task-run --ip ${HOST_IP} --data https://storage.googleapis.com/datasets-ew1/taxi-data.csv -p 2
