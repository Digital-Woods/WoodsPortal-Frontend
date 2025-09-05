const forcePrefix = false

const isPrefix = (env) => {
  if (forcePrefix) return true
  return env === 'production'
}
export default isPrefix
