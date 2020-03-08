import * as pulumi from "@pulumi/pulumi"
import * as azure from "@pulumi/azure"
import * as docker from "@pulumi/docker";

const config = new pulumi.Config();

const imageVersion = config.require("version") || "latest"
const serviceGroupName = config.require("service_name") || "importmap-deployer-service"
const resourceGroupName = config.require("resource_group") || "importmap-deployer-cluster"
const imageId = config.require("image_id") || "importmap-deployer"
const namespace = config.require("namespace") || "mfe"
const registryName = config.require("registry") || "mfe"

const importmapDeployerImage = new docker.Image("importmap-deployer", {
  // $AZURE_REGISTRY_NAME.azurecr.io/$NAMESPACE/importmap-deployer
  imageName: pulumi.interpolate`${registryName}.azurecr.io/${namespace}/importmap-deployer:${imageVersion}`,
  build: {
    context: "./",
  },
});

let resourceGroup = new azure.core.ResourceGroup(resourceGroupName, {
    location: "West US 2",
});

// Create an Azure resource (Storage Account)
const account = new azure.storage.Account("importmap-deplopyer-storage", {
    resourceGroupName: resourceGroup.name,
    accountTier: "Standard",
    accountReplicationType: "LRS",
});

let container = new azure.containerservice.Group(serviceGroupName, {
    containers: [{
        name: serviceGroupName,
        image: imageId, // importmapDeployerImage
        memory: 1,
        cpu: 1,
        ports: [{
                port: 80,
                protocol: "TCP"
        }],
    }],
    osType: "Linux",
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
});

export const publicIP = container.ipAddress;

// Export the connection string for the storage account
export const connectionString = account.primaryConnectionString;
