import mongoose, { Schema } from 'mongoose';

const reviewSchema = new mongoose.Schema(
     {
          listing: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Listing',
               required: true,
          },
          review: {
               type: String,
               required: true,
          },
          rating: {
               type: Number,
               required: true,
               min: 1,
               max: 5,
          },
          author: {
               type: Schema.Types.ObjectId,
               ref: "User",
          }
     },
     { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);