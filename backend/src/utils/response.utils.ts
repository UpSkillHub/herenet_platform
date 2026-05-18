// backend/src/utils/response.utils.ts
export const successResponse = (res: any, message: string, data: any = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res: any, message: string, statusCode = 400, errors: any = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};