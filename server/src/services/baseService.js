const { initializeSupabase, getServiceSupabase } = require('../config/supabase');
const { ApiError } = require('../utils/errorHandler');

/**
 * Base service class for Supabase operations
 */
class BaseService {
  constructor() {
    this.supabase = initializeSupabase();
    this.serviceSupabase = null; // Lazy load for admin operations
  }

  /**
   * Get service Supabase client for admin operations
   * @returns {Object} Service Supabase client
   */
  getServiceClient() {
    if (!this.serviceSupabase) {
      this.serviceSupabase = getServiceSupabase();
    }
    return this.serviceSupabase;
  }

  /**
   * Create a new record
   * @param {string} table - Table name
   * @param {Object} data - Data to insert
   * @param {boolean} useServiceRole - Whether to use service role
   * @returns {Promise<Object>} Created record
   */
  async create(table, data, useServiceRole = false) {
    try {
      const client = useServiceRole ? this.getServiceClient() : this.supabase;
      const { data: result, error } = await client
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        throw new ApiError(`Failed to create ${table} record: ${error.message}`, 400);
      }

      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to create ${table} record`, 500);
    }
  }

  /**
   * Find a record by ID
   * @param {string} table - Table name
   * @param {string|number} id - Record ID
   * @param {boolean} useServiceRole - Whether to use service role
   * @returns {Promise<Object>} Found record
   */
  async findById(table, id, useServiceRole = false) {
    try {
      const client = useServiceRole ? this.getServiceClient() : this.supabase;
      const { data: result, error } = await client
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new ApiError(`${table} record not found`, 404);
        }
        throw new ApiError(`Failed to find ${table} record: ${error.message}`, 400);
      }

      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to find ${table} record`, 500);
    }
  }

  /**
   * Find all records with optional filtering
   * @param {string} table - Table name
   * @param {Object} filters - Filter conditions
   * @param {boolean} useServiceRole - Whether to use service role
   * @returns {Promise<Array>} Found records
   */
  async findAll(table, filters = {}, useServiceRole = false) {
    try {
      const client = useServiceRole ? this.getServiceClient() : this.supabase;
      let query = client.from(table).select('*');

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data: result, error } = await query;

      if (error) {
        throw new ApiError(`Failed to fetch ${table} records: ${error.message}`, 400);
      }

      return result || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to fetch ${table} records`, 500);
    }
  }

  /**
   * Update a record by ID
   * @param {string} table - Table name
   * @param {string|number} id - Record ID
   * @param {Object} data - Data to update
   * @param {boolean} useServiceRole - Whether to use service role
   * @returns {Promise<Object>} Updated record
   */
  async updateById(table, id, data, useServiceRole = false) {
    try {
      const client = useServiceRole ? this.getServiceClient() : this.supabase;
      const { data: result, error } = await client
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new ApiError(`${table} record not found`, 404);
        }
        throw new ApiError(`Failed to update ${table} record: ${error.message}`, 400);
      }

      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to update ${table} record`, 500);
    }
  }

  /**
   * Delete a record by ID
   * @param {string} table - Table name
   * @param {string|number} id - Record ID
   * @param {boolean} useServiceRole - Whether to use service role
   * @returns {Promise<Object>} Deleted record
   */
  async deleteById(table, id, useServiceRole = false) {
    try {
      const client = useServiceRole ? this.getServiceClient() : this.supabase;
      const { data: result, error } = await client
        .from(table)
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new ApiError(`${table} record not found`, 404);
        }
        throw new ApiError(`Failed to delete ${table} record: ${error.message}`, 400);
      }

      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to delete ${table} record`, 500);
    }
  }

  /**
   * Execute a custom query
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @param {boolean} useServiceRole - Whether to use service role
   * @returns {Promise<Array>} Query results
   */
  async executeQuery(query, params = [], useServiceRole = false) {
    try {
      const client = useServiceRole ? this.getServiceClient() : this.supabase;
      const { data: result, error } = await client.rpc('execute_sql', {
        query_text: query,
        query_params: params
      });

      if (error) {
        throw new ApiError(`Query execution failed: ${error.message}`, 400);
      }

      return result || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Query execution failed', 500);
    }
  }
}

module.exports = BaseService; 