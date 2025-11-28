const forcePrefix = null // true, false, or null to auto-detect

export const prefix = 'dw'

const isPrefix = (env) => {
  if (forcePrefix != null) return forcePrefix
  return env === 'production'
}
export default isPrefix
