import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.bp_user_admin) {
      const users = await pool.query("SELECT * FROM bp_users");
      res.json({ users: users.rows });
    } else {
      return res.status(401).json({ error: "restricted" });
    }
  } catch (error) {
    res.status(500).json({ erorr: error.message });
  }
});
router.post("/", authenticateToken, async (req, res) => {
  try {
    console.log(req.user);
    if (req.user.bp_user_admin) {
      const hashedPassword = await bcrypt.hash(req.body.bp_user_password, 10);
      const newUser = await pool.query(
        "INSERT INTO bp_users(bp_user_name, bp_user_code, bp_user_territory, bp_user_town, bp_user_touchPoint, bp_user_password, bp_user_admin) VALUES ($1,$2, $3, $4, $5, $6, $7) RETURNING *",
        [
          req.body.bp_user_name,
          req.body.bp_user_code,
          req.body.bp_user_territory,
          req.body.bp_user_town,
          req.body.bp_user_touchPoint,
          hashedPassword,
          false,
        ]
      );
      res.json({ users: newUser.rows[0] });
    } else {
      return res.status(401).json({ error: "restricted" });
    }
  } catch (error) {
    res.status(500).json({ erorr: error.message });
  }
});
export default router;
