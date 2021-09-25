/**
 * Username and passwords are left exposed intentionally so that we are able
 * to mock the information prior to Azure SSO implementation
 */
const loginAsHr = () => {
  userLogin("hr@aio.com", "Pass123$")
}

const loginAsTrainer = () => {
  userLogin("trainer@aio.com", "Pass123$")
}

const loginAsLearner = () => {
  userLogin("learner@aio.com", "Pass123$")
}

const userLogin = (email, password) => {
  auth0App.client.login({
    password,
    username: email,
    realm: "Username-Password-Authentication",
  }, onLoginSuccessful)
}

const onLoginSuccessful = (err, result) => {
  if (err) {
    console.error('[Authentication] Failed to authenticate user due to the following reason: ', err)
    return
  }

  const { expiresIn, idToken } = result
  const expireTimestamp = Date.now() + (expiresIn * 1000)

  localStorage.setItem('idToken', idToken)
  localStorage.setItem('tokenExpiry', expireTimestamp)

  window.location.replace("/pages/home")
}
