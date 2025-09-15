const Notification_activity = require('../models/Notification_activity.model');
const User = require('../models/User.model');

// Create Notification Activity
const createNotificationActivity = async (req, res) => {
  try {
    const {
      user_id,
      Search,
      Favorites_property_updates,
      Favorites_market_reports,
      Your_home,
      Home_loans_Refinancing,
      Property_Management_res,
      Homvill_Rental_manager,
      Building_reviews,
      Portfolio_performance,
      Homvill_news,
      Status
    } = req.body;

    // Validate that user exists
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if notification activity already exists for this user
    const existingActivity = await Notification_activity.findOne({ user_id });
    if (existingActivity) {
      return res.status(400).json({
        success: false,
        message: 'Notification activity already exists for this user'
      });
    }

    const notificationActivity = new Notification_activity({
      user_id,
      Search: Search || { Email: true, Mobile: true },
      Favorites_property_updates: Favorites_property_updates || { Email: true, Mobile: true },
      Favorites_market_reports: Favorites_market_reports || { Email: true, Mobile: true },
      Your_home: Your_home || { Email: true, Mobile: true },
      Home_loans_Refinancing: Home_loans_Refinancing || { Email: true, Mobile: true },
      Property_Management_res: Property_Management_res || { Email: true, Mobile: true },
      Homvill_Rental_manager: Homvill_Rental_manager || { Email: true, Mobile: true },
      Building_reviews: Building_reviews || { Email: true, Mobile: true },
      Portfolio_performance: Portfolio_performance || { Email: true, Mobile: true },
      Homvill_news: Homvill_news || { Email: true, Mobile: true },
      Status: Status !== undefined ? Status : true,
      CreateBy: req.user.user_id,
      UpdatedBy: req.user.user_id
    });

    await notificationActivity.save();

    res.status(201).json({
      success: true,
      message: 'Notification activity created successfully',
      data: notificationActivity
    });
  } catch (error) {
    console.error('Error creating notification activity:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get All Notification Activities
const getAllNotificationActivities = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { user_id: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const notificationActivities = await Notification_activity.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ CreateAt: -1 });

    // Manually populate user data
    for (let activity of notificationActivities) {
      if (activity.user_id) {
        const user = await User.findOne({ user_id: activity.user_id });
        activity.user_id = user ? { user_id: user.user_id, Name: user.Name, last_name: user.last_name, email: user.email, phone: user.phone } : null;
      }
      if (activity.CreateBy) {
        const createUser = await User.findOne({ user_id: activity.CreateBy });
        activity.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (activity.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: activity.UpdatedBy });
        activity.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    const total = await Notification_activity.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Notification activities retrieved successfully',
      data: notificationActivities,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting notification activities:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Notification Activity by ID
const getNotificationActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const notificationActivity = await Notification_activity.findOne({ Notification_activity_id: id });

    // Manually populate user data
    if (notificationActivity) {
      if (notificationActivity.user_id) {
        const user = await User.findOne({ user_id: notificationActivity.user_id });
        notificationActivity.user_id = user ? { user_id: user.user_id, Name: user.Name, last_name: user.last_name, email: user.email, phone: user.phone } : null;
      }
      if (notificationActivity.CreateBy) {
        const createUser = await User.findOne({ user_id: notificationActivity.CreateBy });
        notificationActivity.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (notificationActivity.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: notificationActivity.UpdatedBy });
        notificationActivity.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    if (!notificationActivity) {
      return res.status(404).json({
        success: false,
        message: 'Notification activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification activity retrieved successfully',
      data: notificationActivity
    });
  } catch (error) {
    console.error('Error getting notification activity:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update All Notification Activities (Bulk Update)
const updateAllNotificationActivities = async (req, res) => {
  try {
    const {
      Search,
      Favorites_property_updates,
      Favorites_market_reports,
      Your_home,
      Home_loans_Refinancing,
      Property_Management_res,
      Homvill_Rental_manager,
      Building_reviews,
      Portfolio_performance,
      Homvill_news,
      Status
    } = req.body;

    const userId = req.user.user_id;

    // Find or create notification activity for current user
    let notificationActivity = await Notification_activity.findOne({ user_id: userId });

    if (!notificationActivity) {
      // Create new notification activity if doesn't exist
      notificationActivity = new Notification_activity({
        user_id: userId,
        Search: { Email: true, Mobile: true },
        Favorites_property_updates: { Email: true, Mobile: true },
        Favorites_market_reports: { Email: true, Mobile: true },
        Your_home: { Email: true, Mobile: true },
        Home_loans_Refinancing: { Email: true, Mobile: true },
        Property_Management_res: { Email: true, Mobile: true },
        Homvill_Rental_manager: { Email: true, Mobile: true },
        Building_reviews: { Email: true, Mobile: true },
        Portfolio_performance: { Email: true, Mobile: true },
        Homvill_news: { Email: true, Mobile: true },
        Status: true,
        CreateBy: userId,
        UpdatedBy: userId
      });
    }

    // Update all fields
    if (Search !== undefined) notificationActivity.Search = Search;
    if (Favorites_property_updates !== undefined) notificationActivity.Favorites_property_updates = Favorites_property_updates;
    if (Favorites_market_reports !== undefined) notificationActivity.Favorites_market_reports = Favorites_market_reports;
    if (Your_home !== undefined) notificationActivity.Your_home = Your_home;
    if (Home_loans_Refinancing !== undefined) notificationActivity.Home_loans_Refinancing = Home_loans_Refinancing;
    if (Property_Management_res !== undefined) notificationActivity.Property_Management_res = Property_Management_res;
    if (Homvill_Rental_manager !== undefined) notificationActivity.Homvill_Rental_manager = Homvill_Rental_manager;
    if (Building_reviews !== undefined) notificationActivity.Building_reviews = Building_reviews;
    if (Portfolio_performance !== undefined) notificationActivity.Portfolio_performance = Portfolio_performance;
    if (Homvill_news !== undefined) notificationActivity.Homvill_news = Homvill_news;
    if (Status !== undefined) notificationActivity.Status = Status;

    notificationActivity.UpdatedBy = userId;
    notificationActivity.UpdatedAt = new Date();

    await notificationActivity.save();

    res.status(200).json({
      success: true,
      message: 'All notification activities updated successfully',
      data: notificationActivity
    });
  } catch (error) {
    console.error('Error updating all notification activities:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Notification Activity
const updateNotificationActivity = async (req, res) => {
  try {
    const { 
      Notification_activity_id, 
      user_id,
      Search,
      Favorites_property_updates,
      Favorites_market_reports,
      Your_home,
      Home_loans_Refinancing,
      Property_Management_res,
      Homvill_Rental_manager,
      Building_reviews,
      Portfolio_performance,
      Homvill_news,
      Status 
    } = req.body;

    const notificationActivity = await Notification_activity.findOne({ Notification_activity_id });
    if (!notificationActivity) {
      return res.status(404).json({
        success: false,
        message: 'Notification activity not found'
      });
    }

    // Validate that user exists if user_id is being updated
    if (user_id) {
      const user = await User.findOne({ user_id });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    }

    const updateData = {
      UpdatedBy: req.user.user_id,
      UpdatedAt: new Date()
    };

    if (user_id !== undefined) updateData.user_id = user_id;
    if (Search !== undefined) updateData.Search = Search;
    if (Favorites_property_updates !== undefined) updateData.Favorites_property_updates = Favorites_property_updates;
    if (Favorites_market_reports !== undefined) updateData.Favorites_market_reports = Favorites_market_reports;
    if (Your_home !== undefined) updateData.Your_home = Your_home;
    if (Home_loans_Refinancing !== undefined) updateData.Home_loans_Refinancing = Home_loans_Refinancing;
    if (Property_Management_res !== undefined) updateData.Property_Management_res = Property_Management_res;
    if (Homvill_Rental_manager !== undefined) updateData.Homvill_Rental_manager = Homvill_Rental_manager;
    if (Building_reviews !== undefined) updateData.Building_reviews = Building_reviews;
    if (Portfolio_performance !== undefined) updateData.Portfolio_performance = Portfolio_performance;
    if (Homvill_news !== undefined) updateData.Homvill_news = Homvill_news;
    if (Status !== undefined) updateData.Status = Status;

    const updatedNotificationActivity = await Notification_activity.findOneAndUpdate(
      { Notification_activity_id },
      updateData,
      { new: true }
    );

    // Manually populate user data
    if (updatedNotificationActivity) {
      if (updatedNotificationActivity.user_id) {
        const user = await User.findOne({ user_id: updatedNotificationActivity.user_id });
        updatedNotificationActivity.user_id = user ? { user_id: user.user_id, Name: user.Name, last_name: user.last_name, email: user.email, phone: user.phone } : null;
      }
      if (updatedNotificationActivity.CreateBy) {
        const createUser = await User.findOne({ user_id: updatedNotificationActivity.CreateBy });
        updatedNotificationActivity.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (updatedNotificationActivity.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: updatedNotificationActivity.UpdatedBy });
        updatedNotificationActivity.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Notification activity updated successfully',
      data: updatedNotificationActivity
    });
  } catch (error) {
    console.error('Error updating notification activity:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete Notification Activity (Hard Delete)
const deleteNotificationActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const notificationActivity = await Notification_activity.findOneAndDelete({ Notification_activity_id: id });
    if (!notificationActivity) {
      return res.status(404).json({
        success: false,
        message: 'Notification activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification activity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification activity:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Soft Delete Notification Activity (Deactivate)
const softDeleteNotificationActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const notificationActivity = await Notification_activity.findOneAndUpdate(
      { Notification_activity_id: id },
      { 
        Status: false,
        UpdatedBy: req.user.user_id,
        UpdatedAt: new Date()
      },
      { new: true }
    );

    if (!notificationActivity) {
      return res.status(404).json({
        success: false,
        message: 'Notification activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification activity deactivated successfully',
      data: notificationActivity
    });
  } catch (error) {
    console.error('Error deactivating notification activity:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createNotificationActivity,
  getAllNotificationActivities,
  getNotificationActivityById,
  updateAllNotificationActivities,
  updateNotificationActivity,
  deleteNotificationActivity,
  softDeleteNotificationActivity
};
