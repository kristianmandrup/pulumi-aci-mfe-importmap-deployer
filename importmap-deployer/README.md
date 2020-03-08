# live-import-map-deployer

Sample repo to demonstrate how to extend the Docker Hub image `singlespa/import-map-deployer`.
The image contains a sample `conf.js` config file used when invoking `import-map-deployer`.

```sh
$ import-map-deployer conf.js
# ...
```

Clone this repo and create your own `conf.js` or `config.json` file where location entries point to actual Azure storage blob entries.

Note, that you must have environment variables `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY`, or `AZURE_STORAGE_CONNECTION_STRING` defined for authentication.

`config.json`:

```json
{
  "manifestFormat": "importmap",
  "locations": {
    "prod": {
      "azureContainer": "static",
      "azureBlob": "importmap.json"
    },
  }
}
```

See [Azure storage blobs](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)

## importmap

Note that the image initially contains an empty `importmap.json` file.
You can push updates to the `importmap.json` storage entry (blob) via the `importmap-deployer` service