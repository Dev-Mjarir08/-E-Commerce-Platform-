import { Router } from "express";
import authRouter from "./auth.route.js";
import adminRouter from "./admin.route.js";
import productRouter from "./product.route.js";
import categoryRouter from "./category.route.js";
import cartRouter from "./cart.route.js";
import wishlistRouter from "./wishlist.route.js";
import addressRouter from "./address.route.js";
import orderRouter from "./order.route.js";
import customerRouter from "./customer.route.js";
import vendorRouter from "./vendor.route.js";

const router = Router();

router.use('/api/auth', authRouter);
router.use('/api/admin', adminRouter);
router.use('/api/vendors', vendorRouter);
router.use('/api/vendor', vendorRouter);
router.use('/api/products', productRouter);
router.use('/api/categories', categoryRouter);
router.use('/api/cart', cartRouter);
router.use('/api/wishlist', wishlistRouter);
router.use('/api/addresses', addressRouter);
router.use('/api/orders', orderRouter);
router.use('/api/customer', customerRouter);

export default router;
