import * as jwt from "jsonwebtoken";

/**
 * It takes a payload, signs it with a secret key, and returns a token that expires in one day
 * @param {any} payload - The data you want to store in the token.
 * @returns A token
 */
export const generateToken = (payload:any) => {
    return jwt.sign({ payload }, process.env.SECRET_KEY, { expiresIn:'1d' });
}

/**
 * It takes a token as a parameter and returns the decoded token
 * @param {string} token - The token to be verified
 * @returns The decoded token.
 */
export const compareToken = (token:string) => {
    return jwt.verify(token, process.env.SECRET_KEY);
}