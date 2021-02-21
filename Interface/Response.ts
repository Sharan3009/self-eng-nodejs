export type Response<T> = SuccessResponse<T>|ErrorResponse|null;

export interface SuccessResponse<T> {
    status: "success",
    rnd:string,
    data: T
}

export interface ErrorResponse {
    status: "error",
    rnd:string,
    message: string
}

export interface Tokens {
    authtoken?: string,
    clienttoken?:string
}

export interface SocketData {
    rnd: string,
    payload:any
}