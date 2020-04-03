export const Token = "Token";

export function isAuthorized(req) {
  const authorization = req.headers.get("Authorization");
  return authorization === `Bearer ${Token}`;
}
