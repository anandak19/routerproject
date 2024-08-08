import express from "express"
import { addRouter } from "../controllers/routerController.js"

const router = express.Router()

router.post("/router/add-router", addRouter)

export default router;