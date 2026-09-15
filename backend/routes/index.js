import { Router } from "express";
import authRouter from "./auth.route.js";
import adminRouter from "./admin.route.js";
import productRouter from "./product.route.js";
import categoryRouter from "./category.route.js";

const router = Router();

router.use('/api/auth', authRouter);
router.use('/api/admin', adminRouter);
router.use('/api/products', productRouter);
router.use('/api/categories', categoryRouter);

export default router;
