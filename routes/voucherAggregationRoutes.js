import express from "express"
import { getTotalVouchersForDay } from "../controllers/voucherAggregationController.js"
const router = express.Router()

router.get("/routers/:routerId/vouchers/today/count", getTotalVouchersForDay)

export default router;