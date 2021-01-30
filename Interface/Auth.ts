export interface GoogleAuthConfig{
    clientId: string,
    clientSecret: string,
    callbackURL:string
}

export interface JWTConfig{
    jwtSecret:string,
    jwtExpiresIn:string
}