import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtTokens } from "../utils/jwt-helpers.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { bp_user_code, bp_user_password } = req.body;
    const users = await pool.query(
      "SELECT * FROM bp_users WHERE bp_user_code = $1",
      [bp_user_code]
    );
    if (users.rows.length === 0)
      return res.status(401).json({ error: "bp_user_code incorrect" });
    const hashedPassword = await bcrypt.hash(req.body.bp_user_password, 10);
    console.log(hashedPassword);
    const validPasword = await bcrypt.compare(
      bp_user_password,
      users.rows[0].bp_user_password
    );
    if (!validPasword)
      return res.status(401).json({ error: "bp_user_password incorrect" });
    let tokens = jwtTokens(users.rows[0]);
    res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});
router.get("/refresh_token", (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    if (refresh_token === null)
      return res.status(401).json({ error: "null refresh token" });
    jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      (error, user) => {
        if (error) return res.status(403).json({ error: error.message });
        let tokens = jwtTokens(user);
        res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
        res.json(tokens);
      }
    );
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.delete("/refresh_token", (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "refresh token deleted" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});
export default router;
