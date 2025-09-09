const forcePrefix = true // true, false, or null to auto-detect

export const prefix = 'tw'

const isPrefix = (env) => {
  if (forcePrefix != null) return forcePrefix
  return env === 'production'
}
export default isPrefix
