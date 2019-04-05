# Bach
Orchestrate a vendor agnostic cloud.

## Usage (so far)

When cloning from github
```bash
$ npm link
```
From within the same folder as a bachfile.json
```bash
$ bach task-build
```
Where citylots.features.dat is a file in the current directory
```bash
$ bach task-run --data citylots.features.dat -p 8
```
Stream input
```bash
$ cat citylots.features.dat | bach task-run -p 8
```
Stream input
```bash
$ curl -s https://storage.googleapis.com/public-stuff/GDELT.dat | bach task-run -p 8
```
This command will run the containers on xx.56 while telling them to call back to xx.10 for data streams
```bash
head -n 10000000 GDELT.dat | bach task-run -p 4 --ip 192.168.0.10 --lb 4
```
^ following link explains how to allow docker clients from remote connections
https://docs.docker.com/install/linux/linux-postinstall/#configure-where-the-docker-daemon-listens-for-connections

Run a map reduce style task
```bash
DEBUG=* bach task-run --ip 192.168.0.10 --data https://storage.googleapis.com/datasets-ew2/GDELT.DAT -p 32
```

Run a map reduce style task (in the cloud)
```bash
bach task-run --ip 35.234.147.231 --data https://storage.googleapis.com/datasets-ew2/GDELT.DAT -p 50 -t gce
```

Good video on spot instances https://www.youtube.com/watch?v=tPaW8aBX94k
This may allow for using docker to handle the preemption interrupt `--sig-proxy=false`

## Datasets

Good source of datasets:
https://registry.opendata.aws/

_US IRS filings_
https://registry.opendata.aws/irs990/
https://s3.amazonaws.com/irs-form-990/index_20xx.json

_Massive web crawl database_
https://registry.opendata.aws/commoncrawl/

_Nexrad weather satellite data_
https://docs.opendata.aws/noaa-nexrad/readme.html
Data can be searched byprefix as shown below
https://noaa-nexrad-level2.s3.amazonaws.com/?prefix=2019/01/19

_Database of a subset of all 'events' that occur on this earth._ Scraped from the internet I assume.
https://www.gdeltproject.org/#intro
Smaller 1.1gb version of the dataset http://data.gdeltproject.org/events/GDELT.MASTERREDUCEDV2.1979-2013.zip

Headers for 30gb taxi dataset
http://www.debs2015.org/call-grand-challenge.html
