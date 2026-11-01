import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Property price is required'],
      min: [0, 'Price must be a positive number']
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['Apartment', 'Villa', 'Commercial', 'Penthouse', 'Townhouse', 'Studio'],
      default: 'Apartment'
    },
    status: {
      type: String,
      enum: ['For Sale', 'For Rent', 'Under Offer', 'Sold', 'Rented'],
      default: 'For Sale'
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, default: 'CA' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: 'USA' },
      coordinates: {
        lat: { type: Number, default: 34.0522 },
        lng: { type: Number, default: -118.2437 }
      }
    },
    specifications: {
      bedrooms: { type: Number, default: 1, min: 0 },
      bathrooms: { type: Number, default: 1, min: 0 },
      areaSqFt: { type: Number, required: true, min: 50 },
      parkingSpaces: { type: Number, default: 1 },
      yearBuilt: { type: Number, default: 2022 }
    },
    images: {
      type: [String],
      default: []
    },
    featuredImage: {
      type: String,
      default: ''
    },
    amenities: {
      type: [String],
      default: [
        'Central AC',
        'High-speed WiFi',
        'Parking',
        '24/7 Security'
      ]
    },
    featured: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function () {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(this.price);
});

// Text index for search functionality
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text',
  'location.address': 'text'
});

export default mongoose.model('Property', propertySchema);
