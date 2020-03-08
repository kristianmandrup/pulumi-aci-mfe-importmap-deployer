# live-import-map-deployer

Sample repo to demonstrate how to extend the Docker Hub image `singlespa/import-map-deployer`. 

The image contains a sample `conf.js` config file used when invoking `import-map-deployer`:

```sh
$ import-map-deployer conf.js
```

Clone this repo and create your own `conf.js` file where location entries point to actual Azure storage blob entries.

`http://[unique storage name].blob.core.windows.net/importmap.json`

Sample `conf.js` config file:

```js
{
  //...
  locations: {
    reactMf: 'http://react-microfrontends.blob.core.windows.net/importmap.json',
    //...
  }
}  
```

See [Azure storage blobs](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)

## importmap

Note that the image initially contains an empty `importmap.json` file.
You can push updates to the `importmap.json` storage entry (blob) via the `importmap-deployer` service