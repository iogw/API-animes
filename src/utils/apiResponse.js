class ApiResponse {
  constructor(res) {
    this.res = res;
  }

  success(data = null, message = 'Request successful', statusCode = 200) {
    return this.res.status(statusCode).json({
      success: true,
      data,
      message,
      errors: null,
    });
  }

  error(message = 'An error occurred', errors = [], statusCode = 400) {
    return this.res.status(statusCode).json({
      success: false,
      data: null,
      message,
      errors,
    });
  }
}

class CustomResponses extends ApiResponse {
  notFound(message = 'Resource not found') {
    return this.error(message, [], 404);
  }

  created(data, message = 'Resource created successfully') {
    return this.success(data, message, 201);
  }
}

module.exports = { CustomResponses };
