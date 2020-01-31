# Map Reduce

This mode of operation allows the user to run mapper code across large data files which are accessed via HTTP using the 'range' header to partition the data.

```json
{
  "logical-name": "gdelt",
  "src": "./src",
  "binary": "node",
  "args": [
    "./src/bin.js"
  ],
  "delimiter": "\n",
  "hardware": {
    "cpu": 1,
    "memory": 2048
  }
}
```

The logical name will be used when naming the provisioned virtual machines and will have no effect when running on docker.

The `src` property contains the relative path of the application, this folder will be compressed and sent to the slave to initiate computation. `binary` specifics the binary file which represents the entry point to the program and `args` will be passed in as command line args.

The `delimiter` value represents the utf8 character that the tuples within the data are delimited on, allowing for the framework to guarantee perfect partitioning of data. 

Hardware requirements are translated as exact values when deployed to a virtual machine, and represent upper limits when executed on a docker host.

## Running on Docker

From within the folder containing the bashfile you wish to execute, running the following command will execute the computation on your local machine. The `--ip` flag is required to allow containers to make connections back to the master tool, it will most often simply by the address of your PC on the local network. Running with a `-p` value of 8 will create 8 parallel docker containers.

```bash
bach task-run --ip ${HOST_IP} --data ${DATA_URL} -p 8
```



## Running on Compute Engine

Running on compute engine is very similar to docker, allowing for an easy transition between local development and testing at scale. Simply add the `--target` or `-t` flag and specific gce as the value. It is also important that the deployed virtual machines have access to the provided HOST_IP, meaning it may need to be public.

```bash
bach task-run --ip ${HOST_IP} --data ${DATA_URL} -t gce -p 8
```

