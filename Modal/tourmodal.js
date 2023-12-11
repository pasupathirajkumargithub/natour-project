const slugify = require('slugify');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./usermodel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => console.log('DB connection successful! tour'));

const tourSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
      required: [true, 'A tour must have a name !'],
      unique: true,
      maxlength: [30, 'A tour name must be under 20 character..!'],
      minlength: [10, 'Atour name must be contain atleast 10 or abive'],
    },

    duration: {
      type: Number,
      default: 5,
    },

    maxGroupSize: {
      type: Number,
      default: 8,
      // max: [10, 'The maxGroupSize only have 10 or below'],
      // min: [4, 'The maxGroupSize must be 4 or above'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty !'],
      default: 'Medium',
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty is either : easy, medium , difficuly',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.0,
      max: [5, 'The ratings only have 5 or below'],
      min: [1, 'The ratings must be 1 or above'],
      set: (val) => Math.round(val * 10) / 10,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price !'],
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary !'],
    },

    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description !'],
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a imageCover !'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    images: [String],

    startDates: [Date],

    secretTour: {
      type: Boolean,
    },

    slug: String,

    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },

    toobject: { virtuals: true },
  },
);

tourSchema.index({ price: 10 });

tourSchema.pre('save', async function (next) {
  const guidePromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidePromises);
  next();
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
  });
  next();
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// query middleware

// tourSchema.pre(/^find/, (next) => {
//   this.find({ secretTour: { $ne: true } });
//   this.start = Date.now();
//   next();
// });

// tourSchema.post(/^find/, (doc, next) => {
//   console.log(`Query take ${Date.now() - start} milli-seconds`);
//   console.log(doc);
//   next();
// });

// Aggregate middleware

// tourSchema.pre('aggregate', (next) => {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
