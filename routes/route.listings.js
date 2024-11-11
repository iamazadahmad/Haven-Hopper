import express from 'express';
import multer from 'multer';
import { storage } from '../cloudConfig.js';
import {
     showAllListings,
     showNewListingForm,
     createListing,
     showListingDetails,
     showEditListingForm,
     updateListing,
     deleteListing
} from '../controllers/listings.controller.js';

const router = express.Router();
const upload = multer({ storage });

// Show all listings
router.get('/', showAllListings);

// Form to create a new listing
router.get('/new', showNewListingForm);

// Create a new listing
router.post('/', upload.single('listing[image]'), createListing);

// Show a single listing with populated reviews
router.get('/:id', showListingDetails);

// Form to edit a listing
router.get('/:id/edit', showEditListingForm);

// Update an existing listing
router.put('/:id', upload.single('listing[image]'), updateListing);

// Delete an existing listing and its associated reviews
router.delete('/:id', deleteListing);

export default router;