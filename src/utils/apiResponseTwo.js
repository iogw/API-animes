class ApiResponseTwo {
  constructor(res, data = null, error = []) {
    this.res = res;
    this.data = data;
    this.error = error;
  }
  responseBuilder(code, success, msg) {
    return this.res.status(code).json({
      success: success,
      msg: msg,
      data: this.data,
      error: this.error,
    });
  }
  ok() {
    const code = 200;
    const success = true;
    const msg = 'Request made successfully';
    return this.responseBuilder(code, success, msg);
  }
  created(){
    const code = 201;
    const success = true;
    const msg = 'Resource created successfully';
    return this.responseBuilder(code, success, msg);
  }
  dbError(){
    const code = 500;
    const success = false;
    const msg = 'Database error';
    return this.responseBuilder(code, success, msg);
  }
  error(){
    const code = 500;
    const success = false;
    const msg = 'Database error';
    return this.responseBuilder(code, success, msg);
  }

}

module.exports = ApiResponseTwo;
