/**
 * Authentication Service
 * 
 * Handles user authentication operations including login, signup,
 * and session management. Currently uses mock data for demonstration.
 * 
 * TODO: Integrate with Supabase Auth when backend is ready
 */

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user'
  }
];

/**
 * Mock authentication service
 */
class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.token = localStorage.getItem('auth_token');
    
    // Check if user is already logged in
    if (this.token) {
      this.currentUser = this.getUserFromToken(this.token);
      this.isAuthenticated = !!this.currentUser;
    }
  }

  /**
   * Get user from token (mock implementation)
   * @param {string} token - Authentication token
   * @returns {Object|null} User object or null
   */
  getUserFromToken(token) {
    try {
      // In a real app, this would decode a JWT token
      const userData = JSON.parse(atob(token.split('.')[1]));
      return MOCK_USERS.find(user => user.id === userData.userId) || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login result
   */
  async login(credentials) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { email, password } = credentials;
      
      // Find user in mock data
      const user = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Create mock token
      const token = btoa(JSON.stringify({
        userId: user.id,
        email: user.email,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));

      // Store token and user data
      localStorage.setItem('auth_token', token);
      this.token = token;
      this.currentUser = user;
      this.isAuthenticated = true;

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Signup new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Signup result
   */
  async signup(userData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { email, password, firstName, lastName } = userData;

      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        email,
        password,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Add to mock data (in real app, this would be saved to database)
      MOCK_USERS.push(newUser);

      // Create mock token
      const token = btoa(JSON.stringify({
        userId: newUser.id,
        email: newUser.email,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));

      // Store token and user data
      localStorage.setItem('auth_token', token);
      this.token = token;
      this.currentUser = newUser;
      this.isAuthenticated = true;

      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   * @returns {Promise<Object>} Logout result
   */
  async logout() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Clear local storage
      localStorage.removeItem('auth_token');
      
      // Reset state
      this.token = null;
      this.currentUser = null;
      this.isAuthenticated = false;

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user
   * @returns {Object|null} Current user object
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  /**
   * Get authentication token
   * @returns {string|null} Authentication token
   */
  getToken() {
    return this.token;
  }

  /**
   * Refresh token (mock implementation)
   * @returns {Promise<Object>} Refresh result
   */
  async refreshToken() {
    try {
      if (!this.currentUser) {
        throw new Error('No user logged in');
      }

      // Create new token
      const token = btoa(JSON.stringify({
        userId: this.currentUser.id,
        email: this.currentUser.email,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));

      // Update stored token
      localStorage.setItem('auth_token', token);
      this.token = token;

      return { success: true, token };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password (mock implementation)
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset result
   */
  async resetPassword(email) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        throw new Error('User not found');
      }

      // In a real app, this would send a password reset email
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Social login (mock implementation)
   * @param {string} provider - Social login provider
   * @param {Object} credentials - Social login credentials
   * @returns {Promise<Object>} Social login result
   */
  async socialLogin(provider, credentials) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would handle OAuth flow
      throw new Error(`${provider} login not implemented yet`);
    } catch (error) {
      throw error;
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService; 