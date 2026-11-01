import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: [true, 'Follow-up note is required'],
      trim: true
    },
    followUpDate: {
      type: Date,
      default: Date.now
    },
    scheduledTime: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['Call', 'Email', 'Meeting', 'Site Visit', 'Note'],
      default: 'Call'
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled'],
      default: 'Completed'
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedByName: {
      type: String,
      default: 'Agent'
    }
  },
  {
    timestamps: true
  }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters']
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      trim: true
    },
    message: {
      type: String,
      trim: true,
      default: 'I am interested in learning more about this property.'
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      default: null
    },
    propertyName: {
      type: String,
      default: ''
    },
    propertyPrice: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Interested', 'Negotiation', 'Converted', 'Lost'],
      default: 'New',
      index: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    source: {
      type: String,
      enum: ['Website Enquiry', 'Schedule Tour', 'Direct Call', 'Walk-in', 'Referral'],
      default: 'Website Enquiry'
    },
    preferredContactMethod: {
      type: String,
      enum: ['Email', 'Phone', 'WhatsApp'],
      default: 'Email'
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    followUps: [followUpSchema],
    nextFollowUpDate: {
      type: Date,
      default: null
    },
    conversionValue: {
      type: Number,
      default: 0
    },
    closedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

leadSchema.index({ name: 'text', email: 'text', phone: 'text', propertyName: 'text' });

export default mongoose.model('Lead', leadSchema);
