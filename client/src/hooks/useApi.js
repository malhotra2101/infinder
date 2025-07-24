import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '../shared/services/backendApi';

/**
 * React Query hooks for data fetching
 * Provides consistent data fetching, caching, and error handling
 */

// Query Keys
export const QUERY_KEYS = {
  INFLUENCERS: 'influencers',
  CAMPAIGNS: 'campaigns',
  BRANDS: 'brands',
  APPLICATIONS: 'applications',
  COLLABORATIONS: 'collaborations',
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  SEARCH: 'search',
};

// Generic API hook for any endpoint
export const useApiQuery = (queryKey, queryFn, options = {}) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    ...options,
  });
};

// Generic mutation hook
export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// Influencer API hooks
export const useInfluencers = (filters = {}) => {
  return useApiQuery(
    [QUERY_KEYS.INFLUENCERS, filters],
    () => backendApi.getInfluencers(filters)
  );
};

export const useInfluencer = (id) => {
  return useApiQuery(
    [QUERY_KEYS.INFLUENCERS, id],
    () => backendApi.getInfluencer(id),
    { enabled: !!id }
  );
};

export const useCreateInfluencer = () => {
  return useApiMutation(
    (data) => backendApi.createInfluencer(data),
    {
      invalidateQueries: [[QUERY_KEYS.INFLUENCERS]],
    }
  );
};

export const useUpdateInfluencer = () => {
  return useApiMutation(
    ({ id, data }) => backendApi.updateInfluencer(id, data),
    {
      invalidateQueries: [[QUERY_KEYS.INFLUENCERS]],
    }
  );
};

export const useDeleteInfluencer = () => {
  return useApiMutation(
    (id) => backendApi.deleteInfluencer(id),
    {
      invalidateQueries: [[QUERY_KEYS.INFLUENCERS]],
    }
  );
};

// Campaign API hooks
export const useCampaigns = (filters = {}) => {
  return useApiQuery(
    [QUERY_KEYS.CAMPAIGNS, filters],
    () => backendApi.getCampaigns(filters)
  );
};

export const useCampaign = (id) => {
  return useApiQuery(
    [QUERY_KEYS.CAMPAIGNS, id],
    () => backendApi.getCampaign(id),
    { enabled: !!id }
  );
};

export const useCreateCampaign = () => {
  return useApiMutation(
    (data) => backendApi.createCampaign(data),
    {
      invalidateQueries: [[QUERY_KEYS.CAMPAIGNS]],
    }
  );
};

export const useUpdateCampaign = () => {
  return useApiMutation(
    ({ id, data }) => backendApi.updateCampaign(id, data),
    {
      invalidateQueries: [[QUERY_KEYS.CAMPAIGNS]],
    }
  );
};

export const useDeleteCampaign = () => {
  return useApiMutation(
    (id) => backendApi.deleteCampaign(id),
    {
      invalidateQueries: [[QUERY_KEYS.CAMPAIGNS]],
    }
  );
};

// Brand API hooks
export const useBrands = (filters = {}) => {
  return useApiQuery(
    [QUERY_KEYS.BRANDS, filters],
    () => backendApi.getBrands(filters)
  );
};

export const useBrand = (id) => {
  return useApiQuery(
    [QUERY_KEYS.BRANDS, id],
    () => backendApi.getBrand(id),
    { enabled: !!id }
  );
};

export const useCreateBrand = () => {
  return useApiMutation(
    (data) => backendApi.createBrand(data),
    {
      invalidateQueries: [[QUERY_KEYS.BRANDS]],
    }
  );
};

export const useUpdateBrand = () => {
  return useApiMutation(
    ({ id, data }) => backendApi.updateBrand(id, data),
    {
      invalidateQueries: [[QUERY_KEYS.BRANDS]],
    }
  );
};

export const useDeleteBrand = () => {
  return useApiMutation(
    (id) => backendApi.deleteBrand(id),
    {
      invalidateQueries: [[QUERY_KEYS.BRANDS]],
    }
  );
};

// Application API hooks
export const useApplications = (filters = {}) => {
  return useApiQuery(
    [QUERY_KEYS.APPLICATIONS, filters],
    () => backendApi.getApplications(filters)
  );
};

export const useApplication = (id) => {
  return useApiQuery(
    [QUERY_KEYS.APPLICATIONS, id],
    () => backendApi.getApplication(id),
    { enabled: !!id }
  );
};

export const useCreateApplication = () => {
  return useApiMutation(
    (data) => backendApi.createApplication(data),
    {
      invalidateQueries: [[QUERY_KEYS.APPLICATIONS]],
    }
  );
};

export const useUpdateApplication = () => {
  return useApiMutation(
    ({ id, data }) => backendApi.updateApplication(id, data),
    {
      invalidateQueries: [[QUERY_KEYS.APPLICATIONS]],
    }
  );
};

export const useDeleteApplication = () => {
  return useApiMutation(
    (id) => backendApi.deleteApplication(id),
    {
      invalidateQueries: [[QUERY_KEYS.APPLICATIONS]],
    }
  );
};

// Collaboration API hooks
export const useCollaborations = (filters = {}) => {
  return useApiQuery(
    [QUERY_KEYS.COLLABORATIONS, filters],
    () => backendApi.getCollaborations(filters)
  );
};

export const useCollaboration = (id) => {
  return useApiQuery(
    [QUERY_KEYS.COLLABORATIONS, id],
    () => backendApi.getCollaboration(id),
    { enabled: !!id }
  );
};

export const useCreateCollaboration = () => {
  return useApiMutation(
    (data) => backendApi.createCollaboration(data),
    {
      invalidateQueries: [[QUERY_KEYS.COLLABORATIONS]],
    }
  );
};

export const useUpdateCollaboration = () => {
  return useApiMutation(
    ({ id, data }) => backendApi.updateCollaboration(id, data),
    {
      invalidateQueries: [[QUERY_KEYS.COLLABORATIONS]],
    }
  );
};

export const useDeleteCollaboration = () => {
  return useApiMutation(
    (id) => backendApi.deleteCollaboration(id),
    {
      invalidateQueries: [[QUERY_KEYS.COLLABORATIONS]],
    }
  );
};

// Dashboard API hooks
export const useDashboardData = () => {
  return useApiQuery(
    [QUERY_KEYS.DASHBOARD],
    () => backendApi.getDashboardData(),
    { staleTime: 2 * 60 * 1000 } // 2 minutes for dashboard data
  );
};

// Search API hooks
export const useSearch = (query, filters = {}) => {
  return useApiQuery(
    [QUERY_KEYS.SEARCH, query, filters],
    () => backendApi.search(query, filters),
    { 
      enabled: !!query,
      staleTime: 2 * 60 * 1000,
    }
  );
};

// Profile API hooks
export const useProfile = (id) => {
  return useApiQuery(
    [QUERY_KEYS.PROFILE, id],
    () => backendApi.getProfile(id),
    { 
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes for profile data
    }
  );
};

export const useUpdateProfile = () => {
  return useApiMutation(
    ({ id, data }) => backendApi.updateProfile(id, data),
    {
      invalidateQueries: [[QUERY_KEYS.PROFILE]],
    }
  );
};

// Utility functions
export const prefetchQuery = (queryClient, queryKey, queryFn) => {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000,
  });
};

export const invalidateQueries = (queryClient, queryKey) => {
  return queryClient.invalidateQueries({ queryKey });
};

// Export the backend API for direct use when needed
export { backendApi }; 