import express from "express"
import { loginUser, registerAdmin } from "../controllers/userController.js";

const router = express.Router()

router.post("/user/register/admin", registerAdmin)
router.post("/user/login", loginUser)

export default router;