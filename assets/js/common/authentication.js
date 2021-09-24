const configureClient = async () => {
  const config = {
    domain: "dev-itjxnuny.us.auth0.com",
    clientID: "MpioU9lYlzZpAeaRlAYkwYSurlECOpKM"
  }

  return new auth0.WebAuth(config)
}

const isAuthenticated = () => {
  const idToken = localStorage.getItem('idToken')
  if (!idToken) return false

  const expiryTimestamp = parseInt(localStorage.getItem('tokenExpiry'))
  if (Date.now() >= expiryTimestamp) {
    localStorage.removeItem('idToken')
    localStorage.removeItem('tokenExpiry')
    return false
  }

  return true
}

const ensureAuthenticated = () => {
  if (isAuthenticated()) return
  window.location.replace("/")
}

let auth0App = null

$(document).ready(async () => {
  auth0App = await configureClient()
})
