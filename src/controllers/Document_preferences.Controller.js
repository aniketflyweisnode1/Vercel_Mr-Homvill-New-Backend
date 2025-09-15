const Document_preferences = require('../models/Document_preferences.model');
const User = require('../models/User.model');

// Create Document Preferences
const createDocumentPreferences = async (req, res) => {
  try {
    const {
      Benefits_going_paperless,
      settings,
      Status
    } = req.body;

    const documentPreferences = new Document_preferences({
      Benefits_going_paperless,
      settings: settings || [{
        "I agree to sending, and receiving documents electronically form HomVill, Inc.. with includes HomVill.com": true,
        "I agree to sending, and receiving documents electronically form HomVill Closing Services.": true
      }],
      Status: Status !== undefined ? Status : true,
      CreateBy: req.user.user_id,
      UpdatedBy: req.user.user_id
    });

    await documentPreferences.save();

    res.status(201).json({
      success: true,
      message: 'Document preferences created successfully',
      data: documentPreferences
    });
  } catch (error) {
    console.error('Error creating document preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get All Document Preferences
const getAllDocumentPreferences = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { Benefits_going_paperless: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const documentPreferences = await Document_preferences.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ CreateAt: -1 });

    // Manually populate user data
    for (let docPref of documentPreferences) {
      if (docPref.CreateBy) {
        const createUser = await User.findOne({ user_id: docPref.CreateBy });
        docPref.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (docPref.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: docPref.UpdatedBy });
        docPref.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    const total = await Document_preferences.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Document preferences retrieved successfully',
      data: documentPreferences,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting document preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Document Preferences by ID
const getDocumentPreferencesById = async (req, res) => {
  try {
    const { id } = req.params;

    const documentPreferences = await Document_preferences.findOne({ Document_preferences_id: id });

    // Manually populate user data
    if (documentPreferences) {
      if (documentPreferences.CreateBy) {
        const createUser = await User.findOne({ user_id: documentPreferences.CreateBy });
        documentPreferences.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (documentPreferences.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: documentPreferences.UpdatedBy });
        documentPreferences.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    if (!documentPreferences) {
      return res.status(404).json({
        success: false,
        message: 'Document preferences not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Document preferences retrieved successfully',
      data: documentPreferences
    });
  } catch (error) {
    console.error('Error getting document preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Document Preferences
const updateDocumentPreferences = async (req, res) => {
  try {
    const { 
      Document_preferences_id, 
      Benefits_going_paperless, 
      settings, 
      Status 
    } = req.body;

    const documentPreferences = await Document_preferences.findOne({ Document_preferences_id });
    if (!documentPreferences) {
      return res.status(404).json({
        success: false,
        message: 'Document preferences not found'
      });
    }

    const updateData = {
      UpdatedBy: req.user.user_id,
      UpdatedAt: new Date()
    };

    if (Benefits_going_paperless !== undefined) updateData.Benefits_going_paperless = Benefits_going_paperless;
    if (settings !== undefined) updateData.settings = settings;
    if (Status !== undefined) updateData.Status = Status;

    const updatedDocumentPreferences = await Document_preferences.findOneAndUpdate(
      { Document_preferences_id },
      updateData,
      { new: true }
    );

    // Manually populate user data
    if (updatedDocumentPreferences) {
      if (updatedDocumentPreferences.CreateBy) {
        const createUser = await User.findOne({ user_id: updatedDocumentPreferences.CreateBy });
        updatedDocumentPreferences.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (updatedDocumentPreferences.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: updatedDocumentPreferences.UpdatedBy });
        updatedDocumentPreferences.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Document preferences updated successfully',
      data: updatedDocumentPreferences
    });
  } catch (error) {
    console.error('Error updating document preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete Document Preferences (Hard Delete)
const deleteDocumentPreferences = async (req, res) => {
  try {
    const { id } = req.params;

    const documentPreferences = await Document_preferences.findOneAndDelete({ Document_preferences_id: id });
    if (!documentPreferences) {
      return res.status(404).json({
        success: false,
        message: 'Document preferences not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Document preferences deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Soft Delete Document Preferences (Deactivate)
const softDeleteDocumentPreferences = async (req, res) => {
  try {
    const { id } = req.params;

    const documentPreferences = await Document_preferences.findOneAndUpdate(
      { Document_preferences_id: id },
      { 
        Status: false,
        UpdatedBy: req.user.user_id,
        UpdatedAt: new Date()
      },
      { new: true }
    );

    if (!documentPreferences) {
      return res.status(404).json({
        success: false,
        message: 'Document preferences not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Document preferences deactivated successfully',
      data: documentPreferences
    });
  } catch (error) {
    console.error('Error deactivating document preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createDocumentPreferences,
  getAllDocumentPreferences,
  getDocumentPreferencesById,
  updateDocumentPreferences,
  deleteDocumentPreferences,
  softDeleteDocumentPreferences
};
