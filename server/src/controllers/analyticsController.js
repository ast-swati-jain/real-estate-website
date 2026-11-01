import Lead from '../models/Lead.js';
import Property from '../models/Property.js';

// @desc    Get dashboard metrics, charts, and recent activity
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalProperties = await Property.countDocuments();
    const totalLeads = await Lead.countDocuments();
    const activeEnquiries = await Lead.countDocuments({
      status: { $in: ['New', 'Contacted', 'Interested', 'Negotiation'] }
    });
    const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });

    // Conversion rate
    const conversionRate = totalLeads > 0
      ? Number(((convertedLeads / totalLeads) * 100).toFixed(1))
      : 0;

    // Total converted pipeline value
    const convertedPipeline = await Lead.aggregate([
      { $match: { status: 'Converted' } },
      { $group: { _id: null, totalValue: { $sum: '$conversionValue' } } }
    ]);
    const totalRevenue = convertedPipeline[0]?.totalValue || 0;

    // Leads by status for Donut Chart
    const statusCountsRaw = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusColors = {
      New: '#3b82f6',         // blue
      Contacted: '#06b6d4',   // cyan
      Interested: '#eab308',  // yellow
      Negotiation: '#f97316', // orange
      Converted: '#10b981',   // emerald
      Lost: '#ef4444'         // red
    };

    const allStatuses = ['New', 'Contacted', 'Interested', 'Negotiation', 'Converted', 'Lost'];
    const leadsByStatus = allStatuses.map((st) => {
      const found = statusCountsRaw.find((item) => item._id === st);
      return {
        name: st,
        value: found ? found.count : 0,
        color: statusColors[st] || '#6b7280'
      };
    });

    // Inquiries by property type
    const propertyTypeCounts = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } }
    ]);

    const leadsByPropertyType = propertyTypeCounts.map((item) => ({
      type: item._id,
      count: item.count
    }));

    // Monthly lead trends (past 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAggregation = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          converted: {
            $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = [];
    
    // Fill in last 6 months even if zero
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const monthLabel = `${monthNames[month - 1]} ${year}`;

      const matched = monthlyAggregation.find(
        (m) => m._id.year === year && m._id.month === month
      );

      monthlyTrends.push({
        month: monthLabel,
        leads: matched ? matched.total : 0,
        converted: matched ? matched.converted : 0
      });
    }

    // Recent inquiries / leads
    const recentLeads = await Lead.find()
      .populate('property', 'title location price')
      .sort('-createdAt')
      .limit(6);

    // Upcoming scheduled follow-ups
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingFollowUps = await Lead.find({
      nextFollowUpDate: { $gte: today },
      status: { $nin: ['Converted', 'Lost'] }
    })
      .populate('property', 'title')
      .sort('nextFollowUpDate')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalProperties,
          totalLeads,
          activeEnquiries,
          convertedLeads,
          lostLeads,
          conversionRate,
          totalRevenue
        },
        leadsByStatus,
        leadsByPropertyType,
        monthlyTrends,
        recentLeads,
        upcomingFollowUps
      }
    });
  } catch (error) {
    next(error);
  }
};

