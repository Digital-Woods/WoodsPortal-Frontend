const forcePrefix = null // true, false, or null to auto-detect

export const prefix = 'dw'

const isPrefix = (env) => {
  if (forcePrefix != null) return forcePrefix
  console.log("env", env)
  return env === 'production' || env === 'staging'
}
export default isPrefix
