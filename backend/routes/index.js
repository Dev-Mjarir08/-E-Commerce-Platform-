import { Router } from "express";
import authRouter from "./auth.route.js";
import adminRouter from "./admin.route.js";
import productRouter from "./product.route.js";

const router = Router();

router.use('/api/auth', authRouter);
router.use('/api/admin', adminRouter);
router.use('/api/products', productRouter);

export default router;
