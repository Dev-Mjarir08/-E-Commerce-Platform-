import { Router } from "express";
import authRouter from "./auth.route.js";

const router = Router()
 router.use('/api/auth',authRouter)

export default router;