const Contracts_Company = require('../models/Contracts_Company.model');
const User = require('../models/User.model');
const Contracts_Category = require('../models/Contracts_Category.model');
const Contracts_Contractor_person = require('../models/Contracts_Contractor_person.model');
const Properties = require('../models/Properties.model');

// Create Contracts Company
const createContractsCompany = async (req, res) => {
  try {
    const { Contracts_Company_name, Rate_range, Contractor_name, Contact_No, contracts_category_id } = req.body;

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
      contracts_category_id: contracts_category_id || null,
      Contracts_Company_name: Contracts_Company_name,
      Rate_range: Rate_range || null,
      Contractor_name: Contractor_name || null,
      Contact_No: Contact_No || null,
      CreateBy: req.user?.user_id || null
    });

    const savedCompany = await contractsCompany.save();
    
    // Fetch related data
    const [createByUser, category] = await Promise.all([
      savedCompany.CreateBy ? User.findOne({ user_id: savedCompany.CreateBy }) : null,
      savedCompany.contracts_category_id ? Contracts_Category.findOne({ Contracts_Category_id: savedCompany.contracts_category_id }) : null
    ]);

    const response = savedCompany.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    response.contracts_category_id = category ? { 
      Contracts_Category_id: category.Contracts_Category_id, 
      Contracts_Category_name: category.Contracts_Category_name 
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

    // Get related contractor persons for this company
    const contractorPersons = await Contracts_Contractor_person.find({ 
      company_id: parseInt(id),
      Status: true 
    }).sort({ CreateAt: -1 });

    const [createByUser, updatedByUser, category] = await Promise.all([
      company.CreateBy ? User.findOne({ user_id: company.CreateBy }) : null,
      company.UpdatedBy ? User.findOne({ user_id: company.UpdatedBy }) : null,
      company.contracts_category_id ? Contracts_Category.findOne({ Contracts_Category_id: company.contracts_category_id }) : null
    ]);

    // Populate contractor persons with their related data
    const contractorPersonsResponse = await Promise.all(contractorPersons.map(async (contractorPerson) => {
      const [contractorCreateByUser, contractorUpdatedByUser, contractorCategory, contractorProperty] = await Promise.all([
        contractorPerson.CreateBy ? User.findOne({ user_id: contractorPerson.CreateBy }) : null,
        contractorPerson.UpdatedBy ? User.findOne({ user_id: contractorPerson.UpdatedBy }) : null,
        contractorPerson.category_id ? Contracts_Category.findOne({ Contracts_Category_id: contractorPerson.category_id }) : null,
        contractorPerson.property_id ? Properties.findOne({ Properties_id: contractorPerson.property_id }) : null
      ]);

      const contractorPersonObj = contractorPerson.toObject();
      contractorPersonObj.CreateBy = contractorCreateByUser ? { 
        user_id: contractorCreateByUser.user_id, 
        Name: contractorCreateByUser.Name, 
        email: contractorCreateByUser.email 
      } : null;
      contractorPersonObj.UpdatedBy = contractorUpdatedByUser ? { 
        user_id: contractorUpdatedByUser.user_id, 
        Name: contractorUpdatedByUser.Name, 
        email: contractorUpdatedByUser.email 
      } : null;
      contractorPersonObj.category_id = contractorCategory ? { 
        Contracts_Category_id: contractorCategory.Contracts_Category_id, 
        Contracts_Category_name: contractorCategory.Contracts_Category_name 
      } : null;
      contractorPersonObj.property_id = contractorProperty ? {
        Properties_id: contractorProperty.Properties_id,
        Properties_Status_id: contractorProperty.Properties_Status_id,
        Properties_Category_id: contractorProperty.Properties_Category_id,
        Properties_for: contractorProperty.Properties_for,
        Owner_Fist_name: contractorProperty.Owner_Fist_name,
        Owner_Last_name: contractorProperty.Owner_Last_name,
        Owner_phone_no: contractorProperty.Owner_phone_no,
        Owner_email: contractorProperty.Owner_email,
        Property_cost: contractorProperty.Property_cost,
        Property_year_build: contractorProperty.Property_year_build,
        Property_Plot_size: contractorProperty.Property_Plot_size,
        Property_finished_Sq_ft: contractorProperty.Property_finished_Sq_ft,
        Property_Bed_rooms: contractorProperty.Property_Bed_rooms,
        Property_Full_Baths: contractorProperty.Property_Full_Baths,
        Property_OneTwo_Baths: contractorProperty.Property_OneTwo_Baths,
        Property_Address: contractorProperty.Property_Address,
        Property_city: contractorProperty.Property_city,
        Property_zip: contractorProperty.Property_zip,
        Property_country: contractorProperty.Property_country,
        Property_state: contractorProperty.Property_state,
        Property_Why_sell: contractorProperty.Property_Why_sell,
        Property_Reason_Selling: contractorProperty.Property_Reason_Selling,
        Property_Listing_Price: contractorProperty.Property_Listing_Price,
        Property_Listing_plot_size: contractorProperty.Property_Listing_plot_size,
        Property_Listing_Description: contractorProperty.Property_Listing_Description,
        Property_photos: contractorProperty.Property_photos,
        Appliances: contractorProperty.Appliances,
        floors: contractorProperty.floors,
        others: contractorProperty.others,
        parking: contractorProperty.parking,
        Rooms: contractorProperty.Rooms,
        Status: contractorProperty.Status,
        CreateBy: contractorProperty.CreateBy,
        CreateAt: contractorProperty.CreateAt,
        UpdatedBy: contractorProperty.UpdatedBy,
        UpdatedAt: contractorProperty.UpdatedAt
      } : null;
      return contractorPersonObj;
    }));

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
    response.contracts_category_id = category ? { 
      Contracts_Category_id: category.Contracts_Category_id, 
      Contracts_Category_name: category.Contracts_Category_name 
    } : null;
    response.contractor_persons = contractorPersonsResponse;

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

// Get Contracts Companies by Category ID
const getContractsCompaniesByCategoryId = async (req, res) => {
  try {
    const { category_id } = req.params;
    
    if (!category_id || isNaN(parseInt(category_id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid category ID is required'
      });
    }

    const contractsCompanies = await Contracts_Company.find({ 
      contracts_category_id: parseInt(category_id),
      Status: true 
    }).sort({ CreateAt: -1 });

    const contractsCompaniesResponse = await Promise.all(contractsCompanies.map(async (company) => {
      const [createByUser, updatedByUser, category] = await Promise.all([
        company.CreateBy ? User.findOne({ user_id: company.CreateBy }) : null,
        company.UpdatedBy ? User.findOne({ user_id: company.UpdatedBy }) : null,
        company.contracts_category_id ? Contracts_Category.findOne({ Contracts_Category_id: company.contracts_category_id }) : null
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
      companyObj.contracts_category_id = category ? { 
        Contracts_Category_id: category.Contracts_Category_id, 
        Contracts_Category_name: category.Contracts_Category_name 
      } : null;
      return companyObj;
    }));

    res.status(200).json({
      success: true,
      count: contractsCompaniesResponse.length,
      data: contractsCompaniesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contracts companies by category',
      error: error.message
    });
  }
};

module.exports = {
  createContractsCompany,
  getAllContractsCompanies,
  getContractsCompanyById,
  getContractsCompanyByAuth,
  getContractsCompaniesByCategoryId,
  updateContractsCompany,
  deleteContractsCompany,
  softDeleteContractsCompany
};

