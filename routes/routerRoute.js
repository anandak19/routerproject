import express from "express"
import { addRouter, getRouterByUserId } from "../controllers/routerController.js"

const router = express.Router()

router.get("/router", getRouterByUserId)
router.post("/router/add-router", addRouter)

export default router;