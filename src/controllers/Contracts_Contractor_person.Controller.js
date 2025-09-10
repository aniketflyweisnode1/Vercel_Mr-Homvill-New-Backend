const Contracts_Contractor_person = require('../models/Contracts_Contractor_person.model');
const User = require('../models/User.model');

// Create Contracts Contractor Person
const createContractsContractorPerson = async (req, res) => {
  try {
    const { Contracts_Contractor_person_name } = req.body;

    // Check if contracts contractor person already exists
    const existingContractorPerson = await Contracts_Contractor_person.findOne({ 
      Contracts_Contractor_person_name: Contracts_Contractor_person_name,
      Status: true
    });
    
    if (existingContractorPerson) {
      return res.status(400).json({
        success: false,
        message: 'Contracts contractor person with this name already exists'
      });
    }

    const contractsContractorPerson = new Contracts_Contractor_person({
      Contracts_Contractor_person_name: Contracts_Contractor_person_name,
      CreateBy: req.user?.user_id || null
    });

    const savedContractorPerson = await contractsContractorPerson.save();
    
    // Fetch related data
    const createByUser = savedContractorPerson.CreateBy ? 
      await User.findOne({ user_id: savedContractorPerson.CreateBy }) : null;

    const response = savedContractorPerson.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
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
      const [createByUser, updatedByUser] = await Promise.all([
        contractorPerson.CreateBy ? User.findOne({ user_id: contractorPerson.CreateBy }) : null,
        contractorPerson.UpdatedBy ? User.findOne({ user_id: contractorPerson.UpdatedBy }) : null
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

    const [createByUser, updatedByUser] = await Promise.all([
      contractorPerson.CreateBy ? User.findOne({ user_id: contractorPerson.CreateBy }) : null,
      contractorPerson.UpdatedBy ? User.findOne({ user_id: contractorPerson.UpdatedBy }) : null
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
      const [createByUser, updatedByUser] = await Promise.all([
        contractorPerson.CreateBy ? User.findOne({ user_id: contractorPerson.CreateBy }) : null,
        contractorPerson.UpdatedBy ? User.findOne({ user_id: contractorPerson.UpdatedBy }) : null
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

    // Check if Contracts_Contractor_person_name is being updated and if it already exists
    if (updateData.Contracts_Contractor_person_name) {
      const existingContractorPerson = await Contracts_Contractor_person.findOne({ 
        Contracts_Contractor_person_name: updateData.Contracts_Contractor_person_name,
        Contracts_Contractor_person_id: { $ne: parseInt(id) },
        Status: true
      });
      
      if (existingContractorPerson) {
        return res.status(400).json({
          success: false,
          message: 'Contracts contractor person with this name already exists'
        });
      }
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
    
    const [createByUser, updatedByUser] = await Promise.all([
      updatedContractorPerson.CreateBy ? User.findOne({ user_id: updatedContractorPerson.CreateBy }) : null,
      updatedContractorPerson.UpdatedBy ? User.findOne({ user_id: updatedContractorPerson.UpdatedBy }) : null
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

module.exports = {
  createContractsContractorPerson,
  getAllContractsContractorPersons,
  getContractsContractorPersonById,
  getContractsContractorPersonByAuth,
  updateContractsContractorPerson,
  deleteContractsContractorPerson,
  softDeleteContractsContractorPerson
};

