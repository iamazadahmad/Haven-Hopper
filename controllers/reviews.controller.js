// Import necessary models
import Listing from '../models/model.listing.js';
import Review from '../models/model.review.js';

// Create a new review
export const createReview = async (req, res) => {
     try {
          const { id } = req.params; // Listing ID from URL parameters
          const { reviewData } = req.body; // Review data from the form

          // Create a new review instance
          const newReview = new Review({
               listing: id,
               review: reviewData.review,
               rating: reviewData.rating,
          });

          // Assign the current user as the author of the review
          newReview.author = req.user._id;

          // Save the review to the database
          await newReview.save();

          // Update the listing by adding the new review's ID to the reviews array
          await Listing.findByIdAndUpdate(id, { $push: { reviews: newReview._id } });

          // Redirect to the listing's detail page
          res.status(201).redirect(`/listings/${id}`);
     } catch (err) {
          console.error(`Error creating review: ${err.message}`);
          res.status(500).render('./errors/error.ejs', { message: 'Failed to create review, please try again.' });
     }
};

// Delete a review
export const deleteReview = async (req, res) => {
     try {
          const { reviewId } = req.params; // Review ID from URL parameters
          const reviewToDelete = await Review.findById(reviewId);

          // Check if the review exists
          if (!reviewToDelete) {
               return res.status(404).json({ message: 'Review not found' });
          }

          const currentUser = req.user;
          const listingId = reviewToDelete.listing; // Get the listing ID associated with the review

          // Ensure the current user is the author of the review
          if (currentUser && currentUser._id.equals(reviewToDelete.author._id)) {
               // Delete the review from the database
               await Review.findByIdAndDelete(reviewId);

               // Remove the review ID from the listing's reviews array
               await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
          }

          // Redirect to the listing's detail page after deletion
          res.redirect(`/listings/${listingId}`);
     } catch (err) {
          console.error(`Error deleting review: ${err.message}`);
          res.status(500).json({ message: 'Failed to delete review, please try again.' });
     }
};