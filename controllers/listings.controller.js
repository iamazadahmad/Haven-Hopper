// Import necessary models
import Listing from '../models/model.listing.js';
import Review from '../models/model.review.js';

// Show all listings
export const showAllListings = async (req, res) => {
     try {
          const allListings = await Listing.find({});
          res.render('./listings/listings.ejs', { allListings });
     } catch (err) {
          console.error(`Error fetching listings: ${err.message}`);
          res.status(500).render('./errors/error.ejs', { message: 'Failed to load listings, please try again later.' });
     }
};

// Form to create a new listing
export const showNewListingForm = (req, res) => {
     if (!req.isAuthenticated()) {
          return res.redirect('/login');
     }
     res.render('./listings/listings.new.ejs');
};

// Create a new listing
export const createListing = async (req, res) => {
     try {
          // Check if a file was uploaded
          if (!req.file) {
               console.error('No file uploaded');
               return res.status(400).render('./errors/error.ejs', { message: 'Image upload failed, please try again.' });
          }

          const { path: url, filename } = req.file;
          const newListing = new Listing(req.body.listing);
          newListing.owner = req.user._id; // Set the owner as the current user
          newListing.image = { url, filename }; // Add image details
          await newListing.save();
          res.redirect('/listings');
     } catch (err) {
          console.error(`Error creating listing: ${err.message}`);
          res.status(500).render('./errors/error.ejs', { message: 'Failed to create listing, please try again.' });
     }
};

// Show a single listing with populated reviews
export const showListingDetails = async (req, res) => {
     try {
          const { id } = req.params;
          const listing = await Listing.findById(id)
               .populate({ path: 'reviews', populate: { path: 'author' } })
               .populate('owner');

          if (!listing) {
               return res.status(404).render('./errors/error.ejs', { message: 'Listing not found' });
          }

          res.render('./listings/listings.detail.ejs', { listing });
     } catch (err) {
          console.error(`Error fetching listing: ${err.message}`);
          res.status(500).render('./errors/error.ejs', { message: 'Failed to retrieve the listing, please try again.' });
     }
};

// Form to edit a listing
export const showEditListingForm = async (req, res) => {
     if (!req.isAuthenticated()) {
          return res.redirect('/login');
     }

     try {
          const { id } = req.params;
          const currentUser = req.user;
          const listing = await Listing.findById(id);

          if (!listing) {
               return res.status(404).render('./errors/error.ejs', { message: 'Listing not found for editing' });
          }

          // Ensure the current user is the owner of the listing
          if (currentUser && currentUser._id.equals(listing.owner._id)) {
               res.render('./listings/listings.edit.ejs', { listing });
          }
     } catch (err) {
          console.error(`Error fetching listing for edit: ${err.message}`);
          res.status(500).render('./errors/error.ejs', { message: 'Failed to load the edit page, please try again.' });
     }
};

// Update an existing listing
export const updateListing = async (req, res) => {
     try {
          // Check if a file was uploaded
          if (!req.file) {
               console.error('No file uploaded');
               return res.status(400).render('./errors/error.ejs', { message: 'Image upload failed, please try again.' });
          }

          const { id } = req.params;
          const currentUser = req.user;
          let listing = await Listing.findById(id);

          if (currentUser && currentUser._id.equals(listing.owner._id)) {
               // Update the listing and its image
               const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
               let { path: url, filename } = req.file;
               updatedListing.image = { url, filename };
               await updatedListing.save();

               if (!updatedListing) {
                    return res.status(404).render('./errors/error.ejs', { message: 'Listing not found for updating' });
               }
          }

          res.redirect(`/listings/${id}`);
     } catch (err) {
          console.error(`Error updating listing: ${err.message}`);
          res.status(500).render('./errors/error.ejs', { message: 'Failed to update the listing, please try again.' });
     }
};

// Delete an existing listing and its associated reviews
export const deleteListing = async (req, res) => {
     if (!req.isAuthenticated()) {
          return res.redirect('/login');
     }

     try {
          const { id } = req.params;
          const currentUser = req.user;
          const listingToDelete = await Listing.findById(id).populate('reviews');

          if (!listingToDelete) {
               return res.status(404).render('./errors/error.ejs', { message: 'Listing not found for deletion' });
          }

          // Ensure the current user is the owner of the listing
          if (currentUser && currentUser._id.equals(listingToDelete.owner._id)) {
               // Delete associated reviews and the listing itself
               await Review.deleteMany({ listingToDelete: id });
               await Listing.findByIdAndDelete(id);
          }

          res.redirect('/listings');
     } catch (err) {
          console.error(`Error deleting listing: ${err.message}`);
          res.status(500).render('./errors/error.ejs', { message: 'Failed to delete the listing, please try again.' });
     }
};