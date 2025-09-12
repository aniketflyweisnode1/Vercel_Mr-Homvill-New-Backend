const Industry_get_started_remodeling_company = require('../models/Industry_get_started_remodeling_company.model');
const User = require('../models/User.model');

// Create Industry_get_started_remodeling_company (auth)
const createIndustryGetStartedRemodelingCompany = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      company,
      name,
      email,
      Phone,
      build_manage,
      user_id
    } = req.body;

    const industryGetStartedRemodelingCompany = new Industry_get_started_remodeling_company({
      company,
      name,
      email,
      Phone,
      build_manage,
      user_id: parseInt(user_id),
      CreateBy: userId
    });

    const saved = await industryGetStartedRemodelingCompany.save();

    const [createByUser, mappedUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(201).json({ success: true, message: 'Industry get started remodeling company created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating industry get started remodeling company', error: error.message });
  }
};

// Get all (public)
const getAllIndustryGetStartedRemodelingCompanies = async (req, res) => {
  try {
    const industryGetStartedRemodelingCompanies = await Industry_get_started_remodeling_company.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(industryGetStartedRemodelingCompanies.map(async (industryGetStartedRemodelingCompany) => {
      const [createByUser, updatedByUser, mappedUser] = await Promise.all([
        industryGetStartedRemodelingCompany.CreateBy ? User.findOne({ user_id: industryGetStartedRemodelingCompany.CreateBy }) : null,
        industryGetStartedRemodelingCompany.UpdatedBy ? User.findOne({ user_id: industryGetStartedRemodelingCompany.UpdatedBy }) : null,
        industryGetStartedRemodelingCompany.user_id ? User.findOne({ user_id: industryGetStartedRemodelingCompany.user_id }) : null
      ]);
      const obj = industryGetStartedRemodelingCompany.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started remodeling companies', error: error.message });
  }
};

// Get by id (auth)
const getIndustryGetStartedRemodelingCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const industryGetStartedRemodelingCompany = await Industry_get_started_remodeling_company.findOne({ Industry_remodeling_company_id: parseInt(id) });
    if (!industryGetStartedRemodelingCompany) {
      return res.status(404).json({ success: false, message: 'Industry get started remodeling company not found' });
    }
    const [createByUser, updatedByUser, mappedUser] = await Promise.all([
      industryGetStartedRemodelingCompany.CreateBy ? User.findOne({ user_id: industryGetStartedRemodelingCompany.CreateBy }) : null,
      industryGetStartedRemodelingCompany.UpdatedBy ? User.findOne({ user_id: industryGetStartedRemodelingCompany.UpdatedBy }) : null,
      industryGetStartedRemodelingCompany.user_id ? User.findOne({ user_id: industryGetStartedRemodelingCompany.user_id }) : null
    ]);
    const response = industryGetStartedRemodelingCompany.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started remodeling company', error: error.message });
  }
};

// Get by auth user (auth)
const getIndustryGetStartedRemodelingCompaniesByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const industryGetStartedRemodelingCompanies = await Industry_get_started_remodeling_company.find({ user_id: userId, Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(industryGetStartedRemodelingCompanies.map(async (industryGetStartedRemodelingCompany) => {
      const [createByUser, updatedByUser, mappedUser] = await Promise.all([
        industryGetStartedRemodelingCompany.CreateBy ? User.findOne({ user_id: industryGetStartedRemodelingCompany.CreateBy }) : null,
        industryGetStartedRemodelingCompany.UpdatedBy ? User.findOne({ user_id: industryGetStartedRemodelingCompany.UpdatedBy }) : null,
        industryGetStartedRemodelingCompany.user_id ? User.findOne({ user_id: industryGetStartedRemodelingCompany.user_id }) : null
      ]);
      const obj = industryGetStartedRemodelingCompany.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started remodeling companies by auth', error: error.message });
  }
};

// Update (auth)
const updateIndustryGetStartedRemodelingCompany = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Industry_remodeling_company_id is required in request body' });
    }
    const industryGetStartedRemodelingCompany = await Industry_get_started_remodeling_company.findOne({ Industry_remodeling_company_id: parseInt(id) });
    if (!industryGetStartedRemodelingCompany) {
      return res.status(404).json({ success: false, message: 'Industry get started remodeling company not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Industry_remodeling_company_id') {
        industryGetStartedRemodelingCompany[key] = updateData[key];
      }
    });

    industryGetStartedRemodelingCompany.UpdatedBy = userId;
    industryGetStartedRemodelingCompany.UpdatedAt = new Date();
    const updated = await industryGetStartedRemodelingCompany.save();

    const [createByUser, updatedByUser, mappedUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(200).json({ success: true, message: 'Industry get started remodeling company updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating industry get started remodeling company', error: error.message });
  }
};

module.exports = {
  createIndustryGetStartedRemodelingCompany,
  getAllIndustryGetStartedRemodelingCompanies,
  getIndustryGetStartedRemodelingCompanyById,
  getIndustryGetStartedRemodelingCompaniesByAuth,
  updateIndustryGetStartedRemodelingCompany
};
