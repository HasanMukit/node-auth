import jwt from "jsonwebtoken";

function jwtTokens({ user_id, bp_user_name, bp_user_code, bp_user_admin }) {
  const user = { user_id, bp_user_name, bp_user_code, bp_user_admin };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600s",
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1440m",
  });
  return { accessToken, refreshToken };
}

export { jwtTokens };
