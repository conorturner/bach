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
This command will build and run the containers on xx.56 while telling them to call back to xx.10 for data streams
```bash
bach task-build && head -n 10000000 GDELT.dat | bach task-run -p 4 --ip 192.168.0.10 --lb 4
```
^ following link explains how to allow docker clients from remote connections
https://docs.docker.com/install/linux/linux-postinstall/#configure-where-the-docker-daemon-listens-for-connections

Run a map reduce style task
```bash
bach task-build && bach task-run --ip 192.168.0.10 --data https://storage.googleapis.com/public-stuff/GDELT1MIL.dat -p 4
```

## Task Definitions

#### Run a task that will run until completion and can tolerate being interrupted.
```json
{
  "logical-name": "json-searcher",
  "interruptible": true,
  "binary": "node",
  "args": [
    "bin.js"
  ],
  "delimiter": "\n",
  "hardware": {
    "cpu": {
      "min": 0.1,
      "max": 2
    },
    "memory": {
      "min": 128,
      "max": 256
    },
    "disk": {
      "min": "1g"
    },
    "graphics": null,
    "network": null
  }
}
```

## Program interface

- Data will be streamed into the program and the output of its mapping operation will be streamed to stdout.
- Data sent to stderr will cause abnormal termination (ability to turn this off).
- If a mapper type task is interrupted it will be restarted from start of the current chunk, meaning outputs must be push to stdout only when a chunk is complete, external state could be maintained.
- When streaming a tcp connection will be made from child nodes to parent to carry both up and down stream data

## Co-location of data

- To allow for the most stateless operation data storage should consist of page per gb abstract storage.
- Data can be pre-tiled before upload to allow for easy chunking.

## Event driven architecture
1. `$ bach task run`
2. Check if topics/cloud storage are created
    a. If not, create them and upload dataset (if local uri)
    b. If dataset exists in cloud check hash file(s) for freshness, if need be reupload.
    c. create build/input/output/report storage buckets
    d. if dataset is distributed simply stream directly from remote servers.
4. On upload to code storage an event triggers execution of code and simultaneously triggers a execution.json file in the report folder.
    a. if abstract runtime e.g. nodejs, java, exe. Send code uri to            function and download code and execute in nodevm etc.
    b. if docker image run with sdtin as a pipe from the relevant          command line command e.g. `$ bach storage get $LOGICAL_ID`
5. Run program and pipe outputs into output bucket which will trigger an event placing a report.json file in a report storage.
6. If the program is interrupted it will create a interrupt.json which will trigger an event which will restart the program based on the interrupt report.
7. `$ bach task report`
8. Check report.json files against execution.json file to determine the state of the system. Report as necessary.

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
