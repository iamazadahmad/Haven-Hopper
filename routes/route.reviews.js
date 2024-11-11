import express from 'express';
import { createReview, deleteReview } from '../controllers/reviews.controller.js';

const router = express.Router({ mergeParams: true });

// Route to create a new review
router.post('/', createReview);

// Route to delete a review
router.delete('/:reviewId', deleteReview);

export default router;