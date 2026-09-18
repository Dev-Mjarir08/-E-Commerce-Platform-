import { Router } from 'express';
import {
  getWishlist,
  toggleWishlistItem,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} from '../controllers/wishlist.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// All wishlist actions require user authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/toggle', toggleWishlistItem);
router.post('/items', addToWishlist);
router.delete('/items/:productId', removeFromWishlist);
router.delete('/', clearWishlist);

export default router;
