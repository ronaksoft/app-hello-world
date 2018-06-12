class ApiError extends Error {
  constructor (code, msg, e) {
    super(msg)
    this.code = code
    this.msg = msg
    this.e = e
  }
}


module.exports = ApiError