import express from "express"
import { addRouter, deleteOneRouter, getRouterByUserId } from "../controllers/routerController.js"
import { addVoucherToRouter, deleteVoucherFromRouter } from "../controllers/voucherController.js"

const router = express.Router()

router.get("/router", getRouterByUserId)
router.post("/router/add-router", addRouter)
router.delete("/router/:routerId", deleteOneRouter)
router.patch("/router/voucher/:routerId", addVoucherToRouter)
router.delete('/router/delete-voucher/:routerId/:voucherId', deleteVoucherFromRouter);

export default router;