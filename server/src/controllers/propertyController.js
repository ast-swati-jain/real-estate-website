import Property from '../models/Property.js';

// @desc    Get all properties with filtering, search, pagination, and sorting
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res, next) => {
  try {
    const {
      search,
      city,
      propertyType,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      featured,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Keyword search across title, description, city, address
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { 'location.city': searchRegex },
        { 'location.address': searchRegex }
      ];
    }

    // Filter by city
    if (city && city.trim() !== '' && city !== 'All') {
      query['location.city'] = new RegExp(`^${city.trim()}$`, 'i');
    }

    // Filter by propertyType
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // Filter by status (For Sale, For Rent, etc.)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by budget range (price)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by minimum bedrooms
    if (bedrooms && bedrooms !== 'All') {
      query['specifications.bedrooms'] = { $gte: Number(bedrooms) };
    }

    // Filter by featured
    if (featured !== undefined && featured !== '') {
      query.featured = featured === 'true' || featured === true;
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'area_desc') sortOption = { 'specifications.areaSqFt': -1 };
    else if (sort === 'popular') sortOption = { viewsCount: -1 };
    else sortOption = { createdAt: -1 };

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('agent', 'name email phone avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties for landing page
// @route   GET /api/properties/featured
// @access  Public
export const getFeaturedProperties = async (req, res, next) => {
  try {
    const featured = await Property.find({ featured: true })
      .populate('agent', 'name email phone avatar')
      .limit(6)
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: featured.length,
      data: featured
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate('agent', 'name email phone avatar');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Admin / Agent)
export const createProperty = async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      agent: req.user ? req.user.id : undefined
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Admin / Agent)
export const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('agent', 'name email phone avatar');

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Admin only)
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct cities and property metadata
// @route   GET /api/properties/meta/cities
// @access  Public
export const getPropertyMeta = async (req, res, next) => {
  try {
    const cities = await Property.distinct('location.city');
    const propertyTypes = ['Apartment', 'Villa', 'Commercial', 'Penthouse', 'Townhouse', 'Studio'];
    const priceRange = await Property.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        cities: cities.filter(Boolean).sort(),
        propertyTypes,
        minPrice: priceRange[0]?.minPrice || 0,
        maxPrice: priceRange[0]?.maxPrice || 10000000
      }
    });
  } catch (error) {
    next(error);
  }
};
