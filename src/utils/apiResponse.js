class ApiResponse {
  constructor(res, data = null, error = null) {
    this.res = res;
    this.data = data;
    this.error = error;
  }
  responseBuilder(code, success, msg) {
    return this.res.status(code).json({
      success: success,
      message: msg,
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
  created() {
    const code = 201;
    const success = true;
    const msg = 'Resource created successfully';
    return this.responseBuilder(code, success, msg);
  }
  badRequest() {
    const code = 400;
    const success = false;
    const msg = 'Bad request';
    return this.responseBuilder(code, success, msg);
  }
  notFound() {
    const code = 404;
    const success = false;
    const msg = 'Resource not found';
    return this.responseBuilder(code, success, msg);
  }
  internalServerError() {
    const code = 500;
    const success = false;
    const msg = 'Internal server error';
    return this.responseBuilder(code, success, msg);
  }
}

function jsonRes(res, method, { data = undefined, error = undefined } = {}) {
  const jsonRes = new ApiResponse(res, data, error);

  if (typeof jsonRes[method] === 'function') {
    return jsonRes[method]();
  } else {
    return console.log('CHECK CONTROLLER: METHOD NAME');
  }
}

module.exports =  jsonRes ;
