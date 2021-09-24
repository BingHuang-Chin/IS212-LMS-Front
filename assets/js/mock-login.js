/**
 * Username and passwords are left exposed intentionally so that we are able
 * to mock the information prior to Azure SSO implementation
 */
const loginAsHr = () => {
  auth0App.client.login({
    realm: "Username-Password-Authentication",
    username: "hr@aio.com",
    password: "Pass123$"
  }, onLoginSuccessful)
}

const loginAsTrainer = () => {
  auth0App.client.login({
    realm: "Username-Password-Authentication",
    username: "trainer@aio.com",
    password: "Pass123$"
  }, onLoginSuccessful)
}

const loginAsLearner = () => {
  auth0App.client.login({
    realm: "Username-Password-Authentication",
    username: "learner@aio.com",
    password: "Pass123$"
  }, onLoginSuccessful)
}

const onLoginSuccessful = (err, result) => {
  console.log(result.idToken)
}
