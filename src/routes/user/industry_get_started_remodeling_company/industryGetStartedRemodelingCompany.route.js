const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  createIndustryGetStartedRemodelingCompany,
  getAllIndustryGetStartedRemodelingCompanies,
  getIndustryGetStartedRemodelingCompanyById,
  getIndustryGetStartedRemodelingCompaniesByAuth,
  updateIndustryGetStartedRemodelingCompany
} = require('../../../controllers/Industry_get_started_remodeling_company.Controller');

// Create Industry_get_started_remodeling_company (auth)
router.post('/create', auth, createIndustryGetStartedRemodelingCompany);

// Get all Industry_get_started_remodeling_companies (public)
router.get('/getall', getAllIndustryGetStartedRemodelingCompanies);

// Get Industry_get_started_remodeling_company by ID (auth)
router.get('/getbyid/:id', auth, getIndustryGetStartedRemodelingCompanyById);

// Get Industry_get_started_remodeling_companies by auth user (auth)
router.get('/getbyauth', auth, getIndustryGetStartedRemodelingCompaniesByAuth);

// Update Industry_get_started_remodeling_company (auth)
router.put('/update', auth, updateIndustryGetStartedRemodelingCompany);

module.exports = router;
