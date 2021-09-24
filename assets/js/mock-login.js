$(document).ready(() => {
  auth0App.client.login({
    realm: "Username-Password-Authentication",
    username: "hr@aio.com",
    password: "thisisahruser"
  }, onLoginSuccessful)
})

const onLoginSuccessful = (err, result) => {
  console.log(err, result)
}
