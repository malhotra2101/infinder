import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '../shared/services/backendApi';

/**
 * Centralized API service layer with React Query integration
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

// Influencer API hooks
export const useInfluencers = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INFLUENCERS, filters],
    queryFn: () => backendApi.getInfluencers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useInfluencer = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INFLUENCERS, id],
    queryFn: () => backendApi.getInfluencer(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateInfluencer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => backendApi.createInfluencer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INFLUENCERS] });
    },
  });
};

export const useUpdateInfluencer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => backendApi.updateInfluencer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INFLUENCERS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INFLUENCERS] });
    },
  });
};

export const useDeleteInfluencer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => backendApi.deleteInfluencer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INFLUENCERS] });
    },
  });
};

// Campaign API hooks
export const useCampaigns = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGNS, filters],
    queryFn: () => backendApi.getCampaigns(filters),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCampaign = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGNS, id],
    queryFn: () => backendApi.getCampaign(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => backendApi.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CAMPAIGNS] });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => backendApi.updateCampaign(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CAMPAIGNS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CAMPAIGNS] });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => backendApi.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CAMPAIGNS] });
    },
  });
};

// Brand API hooks
export const useBrands = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BRANDS, filters],
    queryFn: () => backendApi.getBrands(filters),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useBrand = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BRANDS, id],
    queryFn: () => backendApi.getBrand(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => backendApi.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS] });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => backendApi.updateBrand(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS] });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => backendApi.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS] });
    },
  });
};

// Application API hooks
export const useApplications = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, filters],
    queryFn: () => backendApi.getApplications(filters),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useApplication = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, id],
    queryFn: () => backendApi.getApplication(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => backendApi.createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLICATIONS] });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => backendApi.updateApplication(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLICATIONS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLICATIONS] });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => backendApi.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLICATIONS] });
    },
  });
};

// Collaboration API hooks
export const useCollaborations = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COLLABORATIONS, filters],
    queryFn: () => backendApi.getCollaborations(filters),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCollaboration = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COLLABORATIONS, id],
    queryFn: () => backendApi.getCollaboration(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCollaboration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => backendApi.createCollaboration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLLABORATIONS] });
    },
  });
};

export const useUpdateCollaboration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => backendApi.updateCollaboration(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLLABORATIONS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLLABORATIONS] });
    },
  });
};

export const useDeleteCollaboration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => backendApi.deleteCollaboration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLLABORATIONS] });
    },
  });
};

// Dashboard API hooks
export const useDashboardData = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: () => backendApi.getDashboardData(),
    staleTime: 2 * 60 * 1000, // 2 minutes for dashboard data
    retry: 2,
  });
};

// Search API hooks
export const useSearch = (query, filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH, query, filters],
    queryFn: () => backendApi.search(query, filters),
    enabled: !!query,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
};

// Profile API hooks
export const useProfile = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE, id],
    queryFn: () => backendApi.getProfile(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes for profile data
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => backendApi.updateProfile(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE, id] });
    },
  });
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