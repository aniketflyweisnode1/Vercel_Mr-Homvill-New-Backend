const Language = require('../models/Language.model');
const User = require('../models/User.model');

// Create Language
const createLanguage = async (req, res) => {
  try {
    const { Language_name, code, isRTL } = req.body;

    // Check if language already exists
    const existingLanguage = await Language.findOne({ 
      $or: [
        { Language_name: Language_name },
        { code: code }
      ]
    });
    
    if (existingLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Language with this name or code already exists'
      });
    }

    const language = new Language({
      Language_name,
      code: code.toUpperCase(),
      isRTL: isRTL || false,
      CreateBy: req.user?.user_id || null
    });

    const savedLanguage = await language.save();
    
    // Fetch creator information
    const createByUser = savedLanguage.CreateBy ? 
      await User.findOne({ user_id: savedLanguage.CreateBy }) : null;

    const response = savedLanguage.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    
    res.status(201).json({
      success: true,
      message: 'Language created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating language',
      error: error.message
    });
  }
};

// Get All Languages
const getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find({ Status: true })
      .sort({ CreateAt: -1 });

    const languagesResponse = await Promise.all(languages.map(async (language) => {
      const createByUser = language.CreateBy ? 
        await User.findOne({ user_id: language.CreateBy }) : null;

      const langObj = language.toObject();
      langObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      return langObj;
    }));

    res.status(200).json({
      success: true,
      count: languagesResponse.length,
      data: languagesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching languages',
      error: error.message
    });
  }
};

// Get Language by ID
const getLanguageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const language = await Language.findOne({ 
      Language_id: parseInt(id) 
    });
    
    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Language not found'
      });
    }

    const createByUser = language.CreateBy ? 
      await User.findOne({ user_id: language.CreateBy }) : null;
    const updatedByUser = language.UpdatedBy ? 
      await User.findOne({ user_id: language.UpdatedBy }) : null;

    const response = language.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    response.UpdatedBy = updatedByUser ? { 
      user_id: updatedByUser.user_id, 
      Name: updatedByUser.Name, 
      email: updatedByUser.email 
    } : null;

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching language',
      error: error.message
    });
  }
};

// Update Language
const updateLanguage = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Language ID is required in request body'
      });
    }

    const language = await Language.findOne({ 
      Language_id: parseInt(id) 
    });
    
    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Language not found'
      });
    }

    // Check if name or code is being updated and if it already exists
    if (updateData.Language_name || updateData.code) {
      const existingLanguage = await Language.findOne({ 
        $or: [
          { Language_name: updateData.Language_name },
          { code: updateData.code }
        ],
        Language_id: { $ne: parseInt(id) }
      });
      
      if (existingLanguage) {
        return res.status(400).json({
          success: false,
          message: 'Language with this name or code already exists'
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'Language_id') {
        if (key === 'code') {
          language[key] = updateData[key].toUpperCase();
        } else {
          language[key] = updateData[key];
        }
      }
    });

    language.UpdatedBy = userId;
    language.UpdatedAt = new Date();

    const updatedLanguage = await language.save();
    
    const createByUser = updatedLanguage.CreateBy ? 
      await User.findOne({ user_id: updatedLanguage.CreateBy }) : null;
    const updatedByUser = updatedLanguage.UpdatedBy ? 
      await User.findOne({ user_id: updatedLanguage.UpdatedBy }) : null;

    const response = updatedLanguage.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    response.UpdatedBy = updatedByUser ? { 
      user_id: updatedByUser.user_id, 
      Name: updatedByUser.Name, 
      email: updatedByUser.email 
    } : null;
    
    res.status(200).json({
      success: true,
      message: 'Language updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating language',
      error: error.message
    });
  }
};

// Delete Language (hard delete)
const deleteLanguage = async (req, res) => {
  try {
    const { id } = req.params;

    const language = await Language.findOne({ 
      Language_id: parseInt(id) 
    });
    
    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Language not found'
      });
    }

    await Language.findOneAndDelete({ 
      Language_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'Language deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting language',
      error: error.message
    });
  }
};

// Soft Delete Language (deactivate)
const softDeleteLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const language = await Language.findOne({ 
      Language_id: parseInt(id) 
    });
    
    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Language not found'
      });
    }

    language.Status = false;
    language.UpdatedBy = userId;
    language.UpdatedAt = new Date();
    await language.save();

    res.status(200).json({
      success: true,
      message: 'Language deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating language',
      error: error.message
    });
  }
};

module.exports = {
  createLanguage,
  getAllLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
  softDeleteLanguage
};
