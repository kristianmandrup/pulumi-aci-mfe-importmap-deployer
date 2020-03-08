# Pulumi stack for deploying importmap-deployer on Azure Container Instance

Pulumi Azure Container Instance deployment for [importmap-deployer](https://github.com/single-spa/import-map-deployer) used by [single-spa](https://single-spa.js.org/) [Micro Frontends](https://micro-frontends.org/)
This Pulumi stack is designed to make it easy to set up Azure infrastructure for [importmap-deployer](https://github.com/single-spa/import-map-deployer).
The importmap deployer is a service required for single-spa Micro Frontends to deploy importmaps.

## Prerequisites

Ensure you have [downloaded and installed the Pulumi CLI](https://www.pulumi.com/docs/get-started/install/).

## Stack overview

The stack will:

- Create an Azure Container Instance service named `importmap-deployer-service`
- Define image `importmap-deployer` based on image `importmap-deployer:latest` that must exist in Azure container registry
- Deploy image `importmap-deployer` in service `importmap-deployer-service`
- Create an Azure Storage Bucket `importmap-bucket`
- Create policy to allow all users to access service
- Create policy to allow all users to access bucket

The image `importmap-deployer` can be found in the folder of the same name.

## Resources

- [Pulumi Azure Container Instance service](https://www.pulumi.com/blog/get-started-with-docker-on-Azure-fargate-using-pulumi/)
- [Pulumi Azure bucket](https://www.pulumi.com/docs/Azure/s3/)

## Quickstart

1. Install dependencies
2. Push image to Azure Container Registry (via docker)
3. Run `pulumi up` to create stack on Azure and deploy image on service

### Install

Install dependencies

```sh
$ npm i
# dependencies
```

### Push importmap-deployer image to Azure container registry

Define environment variables

```sh
$ EXPORT AZURE_REGION=eastus
$ EXPORT SERVICE_NAME=importmap-deployer
$ EXPORT AZURE_RESGROUP=mfe
# ...
```

See 
- [Azure Container Registy - Getting started](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-docker-cli)
- [Azure Container Registy - Build and Push image](https://docs.microsoft.com/en-us/azure/devops/pipelines/ecosystems/containers/acr-template?view=azure-devops)

```sh
# Create a resource group
az group create --name $AZURE_RESGROUP --location $AZURE_REGION

# Create a container registry
az acr create --resource-group $AZURE_RESGROUP --name $AZURE_REGISTRY_NAME --sku Basic
```

Login to registry

```sh
$ az acr login --name $AZURE_REGISTRY_NAME
# ...
```

Build image and push to Azure container registry

- [Repository - namespaces](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-best-practices#repository-namespaces)
- [Registries - best practices](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-best-practices)

```sh
$ EXPORT NAMESPACE=mfe
$ docker build -t importmap-deployer
$ docker push $AZURE_REGISTRY_NAME.azurecr.io/$NAMESPACE/importmap-deployer
# ...
```

### Configuring importmap-deployer

Edit the `conf.js` file of the image to point to bucket entries.
Each location entry should point to an actual blob storage entry on Azure which contains an importmap JSON file.

```js
  locations: {
    reactMf: 'http://react-microfrontends.blob.core.windows.net/importmap.json',
  }
```

See [Azure storage blobs](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)

## Run

Note: output when this pulumi stack only built a bucket

```sh
$ pulumi up
# ...

Permalink: https://app.pulumi.com/username/importmap-deployer/dev/updates/1  
```

### Pulumi Configuration

To control the resources being built, use can use [Pulumi Config](https://www.pulumi.com/docs/intro/concepts/config/)

```sh
$ pulumi config set <key> [value]
# ...
```

Passing the `--secret` flag to the config set command encrypts the data and stores the resulting ciphertext instead of plaintext.

```sh
$ pulumi config set --secret dbPassword S3cr37
# ...
```

Alternatively add variables to the `Pulumi.yaml` file

To see the list of config variables

```sh
$ pulumi config
KEY                        VALUE
region                     eastus
dbPassword                 ********
```

To use from within the pulumi source code file `index.ts`

```ts
import * as pulumi from "@pulumi/pulumi";

// create a config singleton containing all set config variables
const config = new pulumi.Config();

// use the config
console.log(`Password: ${config.require("dbPassword")}`);
```

Currently the code uses the following config vars:

- `version`
- `service_name`

```ts
const imageVersion = config.require("version") || "latest"
const serviceName = config.require("service_name") || "importmap-deployer-service"
```
