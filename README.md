# Bach
Orchestrate a vendor agnostic cloud.

## Task Definitions

#### Run a task that will run until completetion and can tolerate being interrupted.
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
    "runtime": "java",
    "tile": {
        "min": 4,
        "max": 10,
        "delimiter": "\n"
    }
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
    "runtime": "java",
    "tile": {
        "min": 4,
        "max": 10,
        "delimiter": null
    }
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
