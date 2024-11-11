import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
     },
}, {
     timestamps: true
});

// Add passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export default mongoose.model("User", userSchema);