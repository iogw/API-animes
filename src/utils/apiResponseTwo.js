class ApiResponse {
  constructor(res, code, success, data, msg, error) {
    this.res = res;
    this.code = code;
    this.success = success;
    this.data = data;
    this.msg = msg;
    this.error = error;
  }
  responseBuilder() {
    return this.res
    .status(this.code)
    .json({
      "success": this.success,
      "data": this.data,
      "msg": this.msg,
      "error": this.error

    });
  }
  success(){
    return this.responseBuilder

  }


}

module.exports = ApiResponse;
