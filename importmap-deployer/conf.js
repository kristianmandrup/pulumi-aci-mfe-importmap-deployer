module.exports = {
  username: process.env.HTTP_USERNAME,
  password: process.env.HTTP_PASSWORD,
  manifestFormat: 'importmap',
  locations: {
    reactMf: 'http://react-microfrontends.blob.core.windows.net/importmap.json',
  }
};