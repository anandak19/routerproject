import express from "express"
import { addRouter, deleteOneRouter, getRouterByUserId } from "../controllers/routerController.js"

const router = express.Router()

router.get("/router", getRouterByUserId)
router.post("/router/add-router", addRouter)
router.delete("/router/:routerId", deleteOneRouter)

export default router;