import FingerprintJS from '@fingerprintjs/fingerprintjs'
async function fingerprintInit() {
  const fp = await FingerprintJS.load()
  //const result = await fp.get()
  return fp
}
const fingerprint = fingerprintInit()
export default {
  install(Vue) {
    Vue.prototype.$fingerprint = fingerprint
  }
}
