/**
 * Authentication Controller
 * 
 * Handles user authentication operations including login, signup,
 * and profile management with database integration.
 */

const { getServiceSupabase } = require('../../../config/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 * @route POST /api/auth/signup
 */
const signup = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    
    const {
      email,
      password,
      brandName,
      industry,
      website,
      employeeCount,
      description,
      contactName,
      marketingEmails
    } = req.body;

    // Validate required fields
    if (!email || !password || !brandName || !industry) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, password, brandName, industry'
      });
    }

    // Check if brand already exists
    const { data: existingBrand, error: checkError } = await supabase
      .from('brands')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: 'Brand with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create brand record
    const { data: newBrand, error: brandError } = await supabase
      .from('brands')
      .insert([{
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        company_name: brandName,
        industry,
        website: website || null,
        employee_count: employeeCount || null,
        description: description || null,
        contact_name: contactName || 'Brand Contact',
        marketing_emails: marketingEmails || false,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (brandError) {
      console.error('Error creating brand:', brandError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create brand account',
        error: brandError.message
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newBrand.id,
        email: newBrand.email,
        brandName: newBrand.company_name 
      },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    // Return brand data (excluding password)
    const { password_hash, ...brandResponse } = newBrand;

    res.status(201).json({
      success: true,
      message: 'Brand account created successfully',
      user: {
        id: brandResponse.id,
        email: brandResponse.email,
        role: brandResponse.role,
        brandName: brandResponse.company_name,
        industry: brandResponse.industry,
        website: brandResponse.website,
        employeeCount: brandResponse.employee_count,
        description: brandResponse.description,
        contactName: brandResponse.contact_name,
        marketingEmails: brandResponse.marketing_emails
      },
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find brand by email
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (brandError || !brand) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, brand.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: brand.id,
        email: brand.email,
        brandName: brand.company_name 
      },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    // Update last login
    await supabase
      .from('brands')
      .update({ 
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', brand.id);

    // Return brand data (excluding password)
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: brand.id,
        email: brand.email,
        role: brand.role,
        brandName: brand.company_name,
        industry: brand.industry,
        website: brand.website,
        employeeCount: brand.employee_count,
        description: brand.description,
        contactName: brand.contact_name,
        marketingEmails: brand.marketing_emails
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
const getProfile = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    
    // Extract user ID from JWT token (middleware should set this)
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - no user ID found'
      });
    }

    // Get brand profile
    const { data: brand, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Return brand data (excluding password)
    res.json({
      success: true,
      user: {
        id: brand.id,
        email: brand.email,
        role: brand.role,
        brandName: brand.company_name,
        industry: brand.industry,
        website: brand.website,
        employeeCount: brand.employee_count,
        description: brand.description,
        contactName: brand.contact_name,
        marketingEmails: brand.marketing_emails,
        createdAt: brand.created_at,
        lastLoginAt: brand.last_login_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  login,
  getProfile
};
