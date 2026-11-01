import express from 'express';
import {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyMeta
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/meta/cities', getPropertyMeta);
router.get('/:id', getPropertyById);

// Protected routes (Admin & Agent)
router.post('/', protect, authorize('admin', 'agent'), createProperty);
router.put('/:id', protect, authorize('admin', 'agent'), updateProperty);
router.delete('/:id', protect, authorize('admin'), deleteProperty);

export default router;

