const configureClient = async () => {
  const config = {
    domain: "dev-itjxnuny.us.auth0.com",
    clientID: "MpioU9lYlzZpAeaRlAYkwYSurlECOpKM"
  }

  return new auth0.WebAuth(config)
}

let auth0App = null

$(document).ready(async () => {
  auth0App = await configureClient()
})
