import express from "express"
import { addRouter, deleteOneRouter, getRouterByUserId } from "../controllers/routerController.js"
import { addVoucherToRouter } from "../controllers/voucherController.js"

const router = express.Router()

router.get("/router", getRouterByUserId)
router.post("/router/add-router", addRouter)
router.delete("/router/:routerId", deleteOneRouter)
router.patch("/router/voucher/:routerId", addVoucherToRouter)

export default router;