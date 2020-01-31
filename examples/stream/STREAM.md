# Stream Processing

Running stream processing tasks using this tool is simple by design, a binary stream of tuples is fed into the stdin stream of the process and the output is returned via stdout. Stderr is used for logging and uses the debug module meaning it will respond to the DEBUG environment variable.

As shown below, data from any source can be piped into the `bach task-run` command. The tool will produce a log output within the terminal and will write the output stream to the `out` file. As this tool respects back pressure through the system, the rate at which stdout is cleared will be proportional to the rate at which input can be processed.

```bash
cat GDELT1MIL.dat | bach task-run --ip ${HOST_IP} -p 1 > out
```

