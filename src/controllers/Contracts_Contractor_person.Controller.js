const Contracts_Contractor_person = require('../models/Contracts_Contractor_person.model');
const User = require('../models/User.model');
const Contracts_Category = require('../models/Contracts_Category.model');
const Properties = require('../models/Properties.model');
const Contracts_Company = require('../models/Contracts_Company.model');

// Create Contracts Contractor Person
const createContractsContractorPerson = async (req, res) => {
  try {
    const { 
      owner,
      property_id,
      category_id,
      contact,
      contractor,
      contracter_img,
      company_id,
      cost,
      address
    } = req.body;

    const contractsContractorPerson = new Contracts_Contractor_person({
      owner,
      property_id,
      category_id,
      contact,
      contractor,
      contracter_img,
      company_id,
      cost,
      address,
      CreateBy: req.user?.user_id || null
    });

    const savedContractorPerson = await contractsContractorPerson.save();
    
    // Fetch related data
    const [createByUser, category, property, company] = await Promise.all([
      savedContractorPerson.CreateBy ? User.findOne({ user_id: savedContractorPerson.CreateBy }) : null,
      savedContractorPerson.category_id ? Contracts_Category.findOne({ Contracts_Category_id: savedContractorPerson.category_id }) : null,
      savedContractorPerson.property_id ? Properties.findOne({ Properties_id: savedContractorPerson.property_id }) : null,
      savedContractorPerson.company_id ? Contracts_Company.findOne({ Contracts_Company_id: savedContractorPerson.company_id }) : null
    ]);

    const response = savedContractorPerson.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    response.category_id = category ? { 
      Contracts_Category_id: category.Contracts_Category_id, 
      Contracts_Category_name: category.Contracts_Category_name 
    } : null;
    response.property_id = property ? { 
      Properties_id: property.Properties_id, 
      Properties_name: property.Properties_name 
    } : null;
    response.company_id = company ? { 
      Contracts_Company_id: company.Contracts_Company_id, 
      Contracts_Company_name: company.Contracts_Company_name 
    } : null;
    
    res.status(201).json({
      success: true,
      message: 'Contracts contractor person created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating contracts contractor person',
      error: error.message
    });
  }
};

// Get All Contracts Contractor Persons
const getAllContractsContractorPersons = async (req, res) => {
  try {
    const contractorPersons = await Contracts_Contractor_person.find({ Status: true })
      .sort({ CreateAt: -1 });

    const contractorPersonsResponse = await Promise.all(contractorPersons.map(async (contractorPerson) => {
      const [createByUser, updatedByUser, category, property, company] = await Promise.all([
        contractorPerson.CreateBy ? User.findOne({ user_id: contractorPerson.CreateBy }) : null,
        contractorPerson.UpdatedBy ? User.findOne({ user_id: contractorPerson.UpdatedBy }) : null,
        contractorPerson.category_id ? Contracts_Category.findOne({ Contracts_Category_id: contractorPerson.category_id }) : null,
        contractorPerson.property_id ? Properties.findOne({ Properties_id: contractorPerson.property_id }) : null,
        contractorPerson.company_id ? Contracts_Company.findOne({ Contracts_Company_id: contractorPerson.company_id }) : null
      ]);

      const contractorPersonObj = contractorPerson.toObject();
      contractorPersonObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      contractorPersonObj.UpdatedBy = updatedByUser ? { 
        user_id: updatedByUser.user_id, 
        Name: updatedByUser.Name, 
        email: updatedByUser.email 
      } : null;
      contractorPersonObj.category_id = category ? { 
        Contracts_Category_id: category.Contracts_Category_id, 
        Contracts_Category_name: category.Contracts_Category_name 
      } : null;
      contractorPersonObj.property_id = property ? { 
        Properties_id: property.Properties_id, 
        Properties_name: property.Properties_name 
      } : null;
      contractorPersonObj.company_id = company ? { 
        Contracts_Company_id: company.Contracts_Company_id, 
        Contracts_Company_name: company.Contracts_Company_name 
      } : null;
      return contractorPersonObj;
    }));

    res.status(200).json({
      success: true,
      count: contractorPersonsResponse.length,
      data: contractorPersonsResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contracts contractor persons',
      error: error.message
    });
  }
};

// Get Contracts Contractor Person by ID
const getContractsContractorPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contractorPerson = await Contracts_Contractor_person.findOne({ 
      Contracts_Contractor_person_id: parseInt(id) 
    });
    
    if (!contractorPerson) {
      return res.status(404).json({
        success: false,
        message: 'Contracts contractor person not found'
      });
    }

    const [createByUser, updatedByUser, category, property, company] = await Promise.all([
      contractorPerson.CreateBy ? User.findOne({ user_id: contractorPerson.CreateBy }) : null,
      contractorPerson.UpdatedBy ? User.findOne({ user_id: contractorPerson.UpdatedBy }) : null,
      contractorPerson.category_id ? Contracts_Category.findOne({ Contracts_Category_id: contractorPerson.category_id }) : null,
      contractorPerson.property_id ? Properties.findOne({ Properties_id: contractorPerson.property_id }) : null,
      contractorPerson.company_id ? Contracts_Company.findOne({ Contracts_Company_id: contractorPerson.company_id }) : null
    ]);

    const response = contractorPerson.toObject();
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
    response.category_id = category ? { 
      Contracts_Category_id: category.Contracts_Category_id, 
      Contracts_Category_name: category.Contracts_Category_name 
    } : null;
    response.property_id = property ? {
      Properties_id: property.Properties_id,
      Properties_Status_id: property.Properties_Status_id,
      Properties_Category_id: property.Properties_Category_id,
      Properties_for: property.Properties_for,
      Owner_Fist_name: property.Owner_Fist_name,
      Owner_Last_name: property.Owner_Last_name,
      Owner_phone_no: property.Owner_phone_no,
      Owner_email: property.Owner_email,
      Property_cost: property.Property_cost,
      Property_year_build: property.Property_year_build,
      Property_Plot_size: property.Property_Plot_size,
      Property_finished_Sq_ft: property.Property_finished_Sq_ft,
      Property_Bed_rooms: property.Property_Bed_rooms,
      Property_Full_Baths: property.Property_Full_Baths,
      Property_OneTwo_Baths: property.Property_OneTwo_Baths,
      Property_Address: property.Property_Address,
      Property_city: property.Property_city,
      Property_zip: property.Property_zip,
      Property_country: property.Property_country,
      Property_state: property.Property_state,
      Property_Why_sell: property.Property_Why_sell,
      Property_Reason_Selling: property.Property_Reason_Selling,
      Property_Listing_Price: property.Property_Listing_Price,
      Property_Listing_plot_size: property.Property_Listing_plot_size,
      Property_Listing_Description: property.Property_Listing_Description,
      Property_photos: property.Property_photos,
      Appliances: property.Appliances,
      floors: property.floors,
      others: property.others,
      parking: property.parking,
      Rooms: property.Rooms,
      Status: property.Status,
      CreateBy: property.CreateBy,
      CreateAt: property.CreateAt,
      UpdatedBy: property.UpdatedBy,
      UpdatedAt: property.UpdatedAt
    } : null;
    response.company_id = company ? { 
      Contracts_Company_id: company.Contracts_Company_id, 
      Contracts_Company_name: company.Contracts_Company_name 
    } : null;

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contracts contractor person',
      error: error.message
    });
  }
};

// Get Contracts Contractor Person by Auth (for authenticated user)
const getContractsContractorPersonByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const contractorPersons = await Contracts_Contractor_person.find({ 
      Status: true,
      CreateBy: userId 
    }).sort({ CreateAt: -1 });

    const contractorPersonsResponse = await Promise.all(contractorPersons.map(async (contractorPerson) => {
      const [createByUser, updatedByUser, category] = await Promise.all([
        contractorPerson.CreateBy ? User.findOne({ user_id: contractorPerson.CreateBy }) : null,
        contractorPerson.UpdatedBy ? User.findOne({ user_id: contractorPerson.UpdatedBy }) : null,
        contractorPerson.category_id ? Contracts_Category.findOne({ Contracts_Category_id: contractorPerson.category_id }) : null
      ]);

      const contractorPersonObj = contractorPerson.toObject();
      contractorPersonObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      contractorPersonObj.UpdatedBy = updatedByUser ? { 
        user_id: updatedByUser.user_id, 
        Name: updatedByUser.Name, 
        email: updatedByUser.email 
      } : null;
      contractorPersonObj.category_id = category ? { 
        Contracts_Category_id: category.Contracts_Category_id, 
        Contracts_Category_name: category.Contracts_Category_name 
      } : null;
      return contractorPersonObj;
    }));

    res.status(200).json({
      success: true,
      count: contractorPersonsResponse.length,
      data: contractorPersonsResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contracts contractor persons for user',
      error: error.message
    });
  }
};

// Update Contracts Contractor Person
const updateContractsContractorPerson = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Contracts contractor person ID is required in request body'
      });
    }

    const contractorPerson = await Contracts_Contractor_person.findOne({ 
      Contracts_Contractor_person_id: parseInt(id) 
    });
    
    if (!contractorPerson) {
      return res.status(404).json({
        success: false,
        message: 'Contracts contractor person not found'
      });
    }


    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'Contracts_Contractor_person_id') {
        contractorPerson[key] = updateData[key];
      }
    });

    contractorPerson.UpdatedBy = userId;
    contractorPerson.UpdatedAt = new Date();

    const updatedContractorPerson = await contractorPerson.save();
    
    const [createByUser, updatedByUser, category, property, company] = await Promise.all([
      updatedContractorPerson.CreateBy ? User.findOne({ user_id: updatedContractorPerson.CreateBy }) : null,
      updatedContractorPerson.UpdatedBy ? User.findOne({ user_id: updatedContractorPerson.UpdatedBy }) : null,
      updatedContractorPerson.category_id ? Contracts_Category.findOne({ Contracts_Category_id: updatedContractorPerson.category_id }) : null,
      updatedContractorPerson.property_id ? Properties.findOne({ Properties_id: updatedContractorPerson.property_id }) : null,
      updatedContractorPerson.company_id ? Contracts_Company.findOne({ Contracts_Company_id: updatedContractorPerson.company_id }) : null
    ]);

    const response = updatedContractorPerson.toObject();
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
    response.category_id = category ? { 
      Contracts_Category_id: category.Contracts_Category_id, 
      Contracts_Category_name: category.Contracts_Category_name 
    } : null;
    response.property_id = property ? { 
      Properties_id: property.Properties_id, 
      Properties_name: property.Properties_name 
    } : null;
    response.company_id = company ? { 
      Contracts_Company_id: company.Contracts_Company_id, 
      Contracts_Company_name: company.Contracts_Company_name 
    } : null;
    
    res.status(200).json({
      success: true,
      message: 'Contracts contractor person updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contracts contractor person',
      error: error.message
    });
  }
};

// Delete Contracts Contractor Person (hard delete)
const deleteContractsContractorPerson = async (req, res) => {
  try {
    const { id } = req.params;

    const contractorPerson = await Contracts_Contractor_person.findOne({ 
      Contracts_Contractor_person_id: parseInt(id) 
    });
    
    if (!contractorPerson) {
      return res.status(404).json({
        success: false,
        message: 'Contracts contractor person not found'
      });
    }

    await Contracts_Contractor_person.findOneAndDelete({ 
      Contracts_Contractor_person_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'Contracts contractor person deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contracts contractor person',
      error: error.message
    });
  }
};

// Soft Delete Contracts Contractor Person (deactivate)
const softDeleteContractsContractorPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const contractorPerson = await Contracts_Contractor_person.findOne({ 
      Contracts_Contractor_person_id: parseInt(id) 
    });
    
    if (!contractorPerson) {
      return res.status(404).json({
        success: false,
        message: 'Contracts contractor person not found'
      });
    }

    contractorPerson.Status = false;
    contractorPerson.UpdatedBy = userId;
    contractorPerson.UpdatedAt = new Date();
    await contractorPerson.save();

    res.status(200).json({
      success: true,
      message: 'Contracts contractor person deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating contracts contractor person',
      error: error.message
    });
  }
};

// Get All Contracts Contractor Persons by Query (Filter by property_id, category_id, company_id)
const getAllContractsContractorPersonsByQuery = async (req, res) => {
  try {
    const { property_id, category_id, company_id } = req.query;
    
    // Build query object
    const query = { Status: true };
    
    // Add filters if provided
    if (property_id) {
      query.property_id = parseInt(property_id);
    }
    if (category_id) {
      query.category_id = parseInt(category_id);
    }
    if (company_id) {
      query.company_id = parseInt(company_id);
    }

    const contractorPersons = await Contracts_Contractor_person.find(query)
      .sort({ CreateAt: -1 });

    const contractorPersonsResponse = await Promise.all(contractorPersons.map(async (contractorPerson) => {
      const [createByUser, updatedByUser, category, property, company] = await Promise.all([
        contractorPerson.CreateBy ? User.findOne({ user_id: contractorPerson.CreateBy }) : null,
        contractorPerson.UpdatedBy ? User.findOne({ user_id: contractorPerson.UpdatedBy }) : null,
        contractorPerson.category_id ? Contracts_Category.findOne({ Contracts_Category_id: contractorPerson.category_id }) : null,
        contractorPerson.property_id ? Properties.findOne({ Properties_id: contractorPerson.property_id }) : null,
        contractorPerson.company_id ? Contracts_Company.findOne({ Contracts_Company_id: contractorPerson.company_id }) : null
      ]);

      const contractorPersonObj = contractorPerson.toObject();
      contractorPersonObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      contractorPersonObj.UpdatedBy = updatedByUser ? { 
        user_id: updatedByUser.user_id, 
        Name: updatedByUser.Name, 
        email: updatedByUser.email 
      } : null;
      contractorPersonObj.category_id = category ? { 
        Contracts_Category_id: category.Contracts_Category_id, 
        Contracts_Category_name: category.Contracts_Category_name 
      } : null;
      contractorPersonObj.property_id = property ? {
        Properties_id: property.Properties_id,
        Properties_Status_id: property.Properties_Status_id,
        Properties_Category_id: property.Properties_Category_id,
        Properties_for: property.Properties_for,
        Owner_Fist_name: property.Owner_Fist_name,
        Owner_Last_name: property.Owner_Last_name,
        Owner_phone_no: property.Owner_phone_no,
        Owner_email: property.Owner_email,
        Property_cost: property.Property_cost,
        Property_year_build: property.Property_year_build,
        Property_Plot_size: property.Property_Plot_size,
        Property_finished_Sq_ft: property.Property_finished_Sq_ft,
        Property_Bed_rooms: property.Property_Bed_rooms,
        Property_Full_Baths: property.Property_Full_Baths,
        Property_OneTwo_Baths: property.Property_OneTwo_Baths,
        Property_Address: property.Property_Address,
        Property_city: property.Property_city,
        Property_zip: property.Property_zip,
        Property_country: property.Property_country,
        Property_state: property.Property_state,
        Property_Why_sell: property.Property_Why_sell,
        Property_Reason_Selling: property.Property_Reason_Selling,
        Property_Listing_Price: property.Property_Listing_Price,
        Property_Listing_plot_size: property.Property_Listing_plot_size,
        Property_Listing_Description: property.Property_Listing_Description,
        Property_photos: property.Property_photos,
        Appliances: property.Appliances,
        floors: property.floors,
        others: property.others,
        parking: property.parking,
        Rooms: property.Rooms,
        Status: property.Status,
        CreateBy: property.CreateBy,
        CreateAt: property.CreateAt,
        UpdatedBy: property.UpdatedBy,
        UpdatedAt: property.UpdatedAt
      } : null;
      contractorPersonObj.company_id = company ? { 
        Contracts_Company_id: company.Contracts_Company_id, 
        Contracts_Company_name: company.Contracts_Company_name 
      } : null;
      return contractorPersonObj;
    }));

    res.status(200).json({
      success: true,
      count: contractorPersonsResponse.length,
      filters: {
        property_id: property_id || null,
        category_id: category_id || null,
        company_id: company_id || null
      },
      data: contractorPersonsResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contracts contractor persons by query',
      error: error.message
    });
  }
};

module.exports = {
  createContractsContractorPerson,
  getAllContractsContractorPersons,
  getAllContractsContractorPersonsByQuery,
  getContractsContractorPersonById,
  getContractsContractorPersonByAuth,
  updateContractsContractorPerson,
  deleteContractsContractorPerson,
  softDeleteContractsContractorPerson
};

