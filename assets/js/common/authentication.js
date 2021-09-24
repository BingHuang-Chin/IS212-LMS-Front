const configureClient = async () => {
  const config = {
    domain: "dev-itjxnuny.us.auth0.com",
    client_id: "MpioU9lYlzZpAeaRlAYkwYSurlECOpKM"
  }

  return await createAuth0Client(config)
}

let auth0 = null

$(document).ready(async () => {
  auth0 = await configureClient()
})
