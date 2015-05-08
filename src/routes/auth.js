var config = require('../../config')

var githubOauth = require('github-oauth')({
  githubClient: config.githubBasicClientId,
  githubSecret: config.githubBasicSecretId,
  baseURL:      config.baseURL,
  loginURI:     config.githubLoginURI,
  callbackURI:  config.githubCallbackURI,
  scope: config.githubAccessScope,
})

module.exports = function(app) {
  return // Lets hold off on authentication for now.
  githubOauth.addRoutes(app, function(err, token, res, tokenRes) {
    console.log('Error: ', err)
    console.log('token', token)
    // console.dir(res)
    // console.dir(tokenRes)
  })
}
