/**
 * Username and passwords are left exposed intentionally so that we are able
 * to mock the information prior to Azure SSO implementation
 */
const loginAsHr = url => {
  userLogin("hr@aio.com", "Pass123$", url)
}

const loginAsTrainer = url => {
  userLogin("trainer@aio.com", "Pass123$", url)
}

const loginAsLearner = url => {
  userLogin("learner@aio.com", "Pass123$", url)
}

const userLogin = (email, password, url) => {
  auth0App.client.login({
    password,
    username: email,
    realm: "Username-Password-Authentication",
  }, (err, result) => { onLoginSuccessful(err, result, url) })
}

const onLoginSuccessful = (err, result, url) => {
  if (err) {
    console.error('[Authentication] Failed to authenticate user due to the following reason: ', err)
    return
  }

  const { expiresIn, idToken } = result
  const expireTimestamp = Date.now() + (expiresIn * 1000)

  localStorage.setItem('idToken', idToken)
  localStorage.setItem('tokenExpiry', expireTimestamp)

  window.location.replace(url)
}
