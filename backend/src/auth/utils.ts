import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}
export function cerTfun(val: string): string {
  val = val.match(/.{1,64}/g).join('\n');
  val = `-----BEGIN CERTIFICATE-----\n${val}\n-----END CERTIFICATE-----\n`;
  return val;
}