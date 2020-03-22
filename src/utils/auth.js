const tokenKey = 'token'

export function getToken() {
  return window.localStorage.getItem(tokenKey)
}

export function setToken(token) {
  return window.localStorage.setItem(tokenKey, token)
}

export function removeToken() {
  return window.localStorage.removeItem(tokenKey)
}
