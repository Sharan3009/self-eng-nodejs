export type Response<T> = SuccessResponse<T>|ErrorResponse|null;

export interface SuccessResponse<T> {
    status: "success",
    data: T
}

export interface ErrorResponse {
    status: "error",
    message: string
}