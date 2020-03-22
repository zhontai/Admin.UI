export function isExternalLink(path) {
  return /^(http?:|https?:|mailto:|tel:)/.test(path)
}
