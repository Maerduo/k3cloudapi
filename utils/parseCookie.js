function parseCookies (cookies) {
  const list = {}
  const rc = cookies.join(';')
  rc && rc.split(';').forEach(cookie => {
    const parts = cookie.split('=')
    list[parts.shift().trim()] = decodeURI(parts.join('='))
  })
  return list
}
module.exports = parseCookies
