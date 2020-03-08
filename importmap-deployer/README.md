# live-import-map-deployer

Sample repo to demonstrate how to extend the Docker Hub image `singlespa/import-map-deployer`. 

Contains a sample `conf.js` used when invoking `import-map-deployer`:

```sh
$ import-map-deployer conf.js
```

Clone this repo and create your own `conf.js` file where location entries point to actual Azure storage blob entries.

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
