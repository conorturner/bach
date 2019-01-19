# Bach
Orchestrate a vendor agnostic cloud.

## Task Definitions

#### Run a task that will run until completion and can tolerate being interrupted.
```json
{
    "logical-name": "cache-refiller",
    "type":"task",
    "interruptible": true,
    "runtime": "docker",
    "hardware": {
        "cpu": {
            "min": 1,
            "max": null
        },
        "memory": {
            "min": 128,
            "max": null
        },
        "disk": {
            "min": "1g"
        },
        "graphics": null,
        "network": null
    }
}
```

#### Run a task which can be tiled
- This would be 128mb of memory per tile, tuning process may reveal that at higher tile counts this can be reduced.
- Tiled processing can be more easily scheduled making more efficient use of resources.
- Tiles will be split at roughly even byte ranges then count forward beginning processing at the next delimiter found.
- Tile count can be easily modulated providing a good range of variables for testing.
- Rows of data could be organised as one object per line in the json example, hence the `\n` delimiter.
- null delimiter would result in data being split at the byte level before being fed into the processor.

*JSON Search*
```json
{
    "logical-name": "json-searcher",
    "type": "mapper",
    "interruptible": true,
    "runtime": "nodejs10",
    "tile": {
        "min": 4,
        "max": 10,
        "delimiter": "\n"
    },
    "hardware": {
        "cpu": {
            "min": 1,
            "max": null
        },
        "memory": {
            "min": 128,
            "max": null
        },
        "disk": {
            "min": "1g"
        },
        "graphics": null,
        "network": null
    }
}
```

*Free Text Search*
```json
{
    "logical-name": "text-searcher",
    "type": "mapper",
    "interruptible": true,
    "runtime": "java10",
    "tile": {
        "min": 4,
        "max": 10,
        "delimiter": null
    },
    "hardware": {
        "cpu": {
            "min": 0.5,
            "max": null
        },
        "memory": {
            "min": 128,
            "max": null
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

## Co-location of data

- To allow for the most stateless operation data storage should consist of page per gb abstract storage.
- Data can be pre-tiled before upload to allow for easy chunking.

## Event driven architecture
1. `$ bach task run`
2. Check if topics/cloud storage are created
3. If not, create them.
4. On upload to code storage an event triggers execution of code and simultaneously triggers a execution.json file in the report folder.
    a. if abstract runtime e.g. nodejs, java, exe. Send code uri to            function and download code and execute in nodevm etc.
    b. if docker image run with sdtin as a pipe from the relevant          command line command e.g. `$ bach storage get $LOGICAL_ID`
5. Run program and pipe outputs into output bucket which will trigger an event placing a report.json file in a report bucket.
6. `$ bach task report`
7. Check report.json files against execution.json file to determine the state of the system. Report as necessary.

## Datasets

Good source of datasets:
https://registry.opendata.aws/

_US IRS filings_
https://registry.opendata.aws/irs990/
https://s3.amazonaws.com/irs-form-990/index_20xx.json

_Massive wb crawl database_
https://registry.opendata.aws/commoncrawl/

_Nexrad weather satellite data_
https://docs.opendata.aws/noaa-nexrad/readme.html

_Database of a subset of all 'events' that occur on this earth._ Scraped from the internet I assume.
https://www.gdeltproject.org/#intro
Mini 1.1gb version of the dataset http://data.gdeltproject.org/events/GDELT.MASTERREDUCEDV2.1979-2013.zip
