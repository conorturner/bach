# Bach

Orchestrate a cluster of preemptible virtual machines on google compute engine.

## Prerequisites

- Node.js
  - Installing node and npm
  - Running as a command line tool
- Docker
  - Setting up docker to run on local machine
  - Setting up a docker host on a local subnet
- Google Cloud CLI
  - Get started with Google Cloud
- Slave docker/vm image

## Installation

### Install via npm
```bash
npm i <tbc> -g
```
### Install from source
Linking will allow changes made to thee source code to be immediately reflected in the tool.
```bash
git clone https://github.com/conorturner/bach.git && \
cd bach && \
npm link
```


## Usage

### The bachfile

Applications are defined using a 'bachfile', this specifies the location of the binary file to be run in the computation. It also contains a definition of the hardware requirements for each slave node.

### Map Reduce

This use case supports a basic map and collect phase reading from any HTTP storage supporting the 'range' header. Documentation is available [here](/examples/reduce/REDUCE.md).

### Stream Processing

Documentation is available [here](/examples/stream/STREAM.md).


## Interesting Datasets

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