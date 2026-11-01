import Lead from '../models/Lead.js';
import Property from '../models/Property.js';

// @desc    Submit a new property enquiry (Public website enquiry form)
// @route   POST /api/leads
// @access  Public
export const createLead = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      propertyId,
      preferredContactMethod,
      source
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone number are required.'
      });
    }

    let propertyName = '';
    let propertyPrice = 0;
    let propertyRef = null;

    if (propertyId) {
      const property = await Property.findById(propertyId);
      if (property) {
        propertyRef = property._id;
        propertyName = property.title;
        propertyPrice = property.price;
      }
    }

    const newLead = await Lead.create({
      name,
      email: email.toLowerCase(),
      phone,
      message: message || 'I am interested in this property listing.',
      property: propertyRef,
      propertyName,
      propertyPrice,
      status: 'New',
      priority: 'Medium',
      source: source || 'Website Enquiry',
      preferredContactMethod: preferredContactMethod || 'Email',
      followUps: [
        {
          note: `Enquiry submitted through website for property: ${propertyName || 'General Inquiry'}`,
          followUpDate: new Date(),
          type: 'Note',
          status: 'Completed',
          addedByName: 'Website System'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received successfully! Our real estate specialist will contact you shortly.',
      data: newLead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads with search, filter, and pagination (CRM)
// @route   GET /api/leads
// @access  Private (Agent / Admin)
export const getLeads = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      source,
      propertyId,
      startDate,
      endDate,
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // Search by name, email, phone, or property title
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { propertyName: searchRegex }
      ];
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Filter by source
    if (source && source !== 'All') {
      query.source = source;
    }

    // Filter by property
    if (propertyId) {
      query.property = propertyId;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('property', 'title price location images propertyType')
      .populate('assignedAgent', 'name email avatar')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead details
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('property')
      .populate('assignedAgent', 'name email avatar');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status (New, Contacted, Interested, Negotiation, Converted, Lost)
// @route   PUT /api/leads/:id/status
// @access  Private
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status, note, conversionValue } = req.body;
    const allowedStatuses = ['New', 'Contacted', 'Interested', 'Negotiation', 'Converted', 'Lost'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const previousStatus = lead.status;
    lead.status = status;

    if (status === 'Converted') {
      lead.closedAt = new Date();
      if (conversionValue) lead.conversionValue = Number(conversionValue);
      else if (lead.propertyPrice) lead.conversionValue = lead.propertyPrice;
    } else if (status === 'Lost') {
      lead.closedAt = new Date();
    }

    // Automatically append follow-up note
    const userDisplayName = req.user ? req.user.name : 'System';
    lead.followUps.unshift({
      note: note || `Status updated from "${previousStatus}" to "${status}"`,
      followUpDate: new Date(),
      type: 'Note',
      status: 'Completed',
      addedBy: req.user ? req.user.id : undefined,
      addedByName: userDisplayName
    });

    await lead.save();

    res.status(200).json({
      success: true,
      message: `Lead status updated to ${status}`,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add follow-up activity / note to a lead
// @route   POST /api/leads/:id/follow-ups
// @access  Private
export const addFollowUp = async (req, res, next) => {
  try {
    const { note, followUpDate, scheduledTime, type, status, nextFollowUpDate } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Follow-up note is required'
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const userDisplayName = req.user ? req.user.name : 'Agent';

    const newFollowUp = {
      note,
      followUpDate: followUpDate ? new Date(followUpDate) : new Date(),
      scheduledTime: scheduledTime || '',
      type: type || 'Call',
      status: status || 'Completed',
      addedBy: req.user ? req.user.id : undefined,
      addedByName: userDisplayName
    };

    lead.followUps.unshift(newFollowUp);

    if (nextFollowUpDate) {
      lead.nextFollowUpDate = new Date(nextFollowUpDate);
    }

    // If current status is New and follow-up was completed, auto-advance to Contacted
    if (lead.status === 'New' && newFollowUp.status === 'Completed') {
      lead.status = 'Contacted';
    }

    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Follow-up recorded successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead details (Priority, Agent, Contact info)
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('property').populate('assignedAgent', 'name email avatar');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin only)
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

