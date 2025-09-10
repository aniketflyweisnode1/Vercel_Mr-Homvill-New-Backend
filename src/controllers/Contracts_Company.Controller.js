const Contracts_Company = require('../models/Contracts_Company.model');
const User = require('../models/User.model');

// Create Contracts Company
const createContractsCompany = async (req, res) => {
  try {
    const { Contracts_Company_name, Rate_range, Contractor_name, Contact_No } = req.body;

    // Check if contracts company already exists
    const existingCompany = await Contracts_Company.findOne({ 
      Contracts_Company_name: Contracts_Company_name,
      Status: true
    });
    
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Contracts company with this name already exists'
      });
    }

    const contractsCompany = new Contracts_Company({
      Contracts_Company_name: Contracts_Company_name,
      Rate_range: Rate_range || null,
      Contractor_name: Contractor_name || null,
      Contact_No: Contact_No || null,
      CreateBy: req.user?.user_id || null
    });

    const savedCompany = await contractsCompany.save();
    
    // Fetch related data
    const createByUser = savedCompany.CreateBy ? 
      await User.findOne({ user_id: savedCompany.CreateBy }) : null;

    const response = savedCompany.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    
    res.status(201).json({
      success: true,
      message: 'Contracts company created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating contracts company',
      error: error.message
    });
  }
};

// Get All Contracts Companies
const getAllContractsCompanies = async (req, res) => {
  try {
    const companies = await Contracts_Company.find({ Status: true })
      .sort({ CreateAt: -1 });

    const companiesResponse = await Promise.all(companies.map(async (company) => {
      const [createByUser, updatedByUser] = await Promise.all([
        company.CreateBy ? User.findOne({ user_id: company.CreateBy }) : null,
        company.UpdatedBy ? User.findOne({ user_id: company.UpdatedBy }) : null
      ]);

      const companyObj = company.toObject();
      companyObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      companyObj.UpdatedBy = updatedByUser ? { 
        user_id: updatedByUser.user_id, 
        Name: updatedByUser.Name, 
        email: updatedByUser.email 
      } : null;
      return companyObj;
    }));

    res.status(200).json({
      success: true,
      count: companiesResponse.length,
      data: companiesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contracts companies',
      error: error.message
    });
  }
};

// Get Contracts Company by ID
const getContractsCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await Contracts_Company.findOne({ 
      Contracts_Company_id: parseInt(id) 
    });
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Contracts company not found'
      });
    }

    const [createByUser, updatedByUser] = await Promise.all([
      company.CreateBy ? User.findOne({ user_id: company.CreateBy }) : null,
      company.UpdatedBy ? User.findOne({ user_id: company.UpdatedBy }) : null
    ]);

    const response = company.toObject();
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
      message: 'Error fetching contracts company',
      error: error.message
    });
  }
};

// Get Contracts Company by Auth (for authenticated user)
const getContractsCompanyByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const companies = await Contracts_Company.find({ 
      Status: true,
      CreateBy: userId 
    }).sort({ CreateAt: -1 });

    const companiesResponse = await Promise.all(companies.map(async (company) => {
      const [createByUser, updatedByUser] = await Promise.all([
        company.CreateBy ? User.findOne({ user_id: company.CreateBy }) : null,
        company.UpdatedBy ? User.findOne({ user_id: company.UpdatedBy }) : null
      ]);

      const companyObj = company.toObject();
      companyObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      companyObj.UpdatedBy = updatedByUser ? { 
        user_id: updatedByUser.user_id, 
        Name: updatedByUser.Name, 
        email: updatedByUser.email 
      } : null;
      return companyObj;
    }));

    res.status(200).json({
      success: true,
      count: companiesResponse.length,
      data: companiesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contracts companies for user',
      error: error.message
    });
  }
};

// Update Contracts Company
const updateContractsCompany = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Contracts company ID is required in request body'
      });
    }

    const company = await Contracts_Company.findOne({ 
      Contracts_Company_id: parseInt(id) 
    });
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Contracts company not found'
      });
    }

    // Check if Contracts_Company_name is being updated and if it already exists
    if (updateData.Contracts_Company_name) {
      const existingCompany = await Contracts_Company.findOne({ 
        Contracts_Company_name: updateData.Contracts_Company_name,
        Contracts_Company_id: { $ne: parseInt(id) },
        Status: true
      });
      
      if (existingCompany) {
        return res.status(400).json({
          success: false,
          message: 'Contracts company with this name already exists'
        });
      }
    }

    // Update fields (including new optional fields)
    Object.keys(updateData).forEach(key => {
      if (key !== 'Contracts_Company_id') {
        company[key] = updateData[key];
      }
    });

    company.UpdatedBy = userId;
    company.UpdatedAt = new Date();

    const updatedCompany = await company.save();
    
    const [createByUser, updatedByUser] = await Promise.all([
      updatedCompany.CreateBy ? User.findOne({ user_id: updatedCompany.CreateBy }) : null,
      updatedCompany.UpdatedBy ? User.findOne({ user_id: updatedCompany.UpdatedBy }) : null
    ]);

    const response = updatedCompany.toObject();
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
      message: 'Contracts company updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contracts company',
      error: error.message
    });
  }
};

// Delete Contracts Company (hard delete)
const deleteContractsCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Contracts_Company.findOne({ 
      Contracts_Company_id: parseInt(id) 
    });
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Contracts company not found'
      });
    }

    await Contracts_Company.findOneAndDelete({ 
      Contracts_Company_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'Contracts company deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contracts company',
      error: error.message
    });
  }
};

// Soft Delete Contracts Company (deactivate)
const softDeleteContractsCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const company = await Contracts_Company.findOne({ 
      Contracts_Company_id: parseInt(id) 
    });
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Contracts company not found'
      });
    }

    company.Status = false;
    company.UpdatedBy = userId;
    company.UpdatedAt = new Date();
    await company.save();

    res.status(200).json({
      success: true,
      message: 'Contracts company deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating contracts company',
      error: error.message
    });
  }
};

module.exports = {
  createContractsCompany,
  getAllContractsCompanies,
  getContractsCompanyById,
  getContractsCompanyByAuth,
  updateContractsCompany,
  deleteContractsCompany,
  softDeleteContractsCompany
};

