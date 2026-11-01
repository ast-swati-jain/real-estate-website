import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  addFollowUp,
  updateLead,
  deleteLead
} from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public: Website users submit inquiries
router.post('/', createLead);

// Protected: CRM team operations
router.get('/', protect, getLeads);
router.get('/:id', protect, getLeadById);
router.put('/:id/status', protect, updateLeadStatus);
router.post('/:id/follow-ups', protect, addFollowUp);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, authorize('admin'), deleteLead);

export default router;

