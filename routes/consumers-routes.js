import express from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.bp_user_admin) {
      const consumers = await pool.query("SELECT * FROM consumer");
      res.json({ consumers: consumers.rows });
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
    const newConsumer = await pool.query(
      "INSERT INTO consumer(consumer_name, consumer_dob, consumer_phn, bp_user_code, onboarding_date) VALUES ($1,$2, $3, $4, $5) RETURNING *",
      [
        req.body.consumer_name,
        req.body.consumer_dob,
        req.body.consumer_phn,
        req.user.bp_user_code,
        new Date(),
      ]
    );
    res.json({ users: newConsumer.rows[0] });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router;
