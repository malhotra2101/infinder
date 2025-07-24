import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  influencerService, 
  campaignService, 
  authService 
} from '../services/api';

// Query keys for React Query
export const queryKeys = {
  influencers: {
    all: ['influencers'],
    lists: () => [...queryKeys.influencers.all, 'list'],
    list: (filters) => [...queryKeys.influencers.lists(), filters],
    details: () => [...queryKeys.influencers.all, 'detail'],
    detail: (id) => [...queryKeys.influencers.details(), id],
    search: (term) => [...queryKeys.influencers.all, 'search', term],
    listCounts: () => [...queryKeys.influencers.all, 'counts'],
    byListType: (type) => [...queryKeys.influencers.all, 'listType', type],
    campaigns: (id) => [...queryKeys.influencers.all, 'campaigns', id],
  },
  campaigns: {
    all: ['campaigns'],
    lists: () => [...queryKeys.campaigns.all, 'list'],
    list: (filters) => [...queryKeys.campaigns.lists(), filters],
    details: () => [...queryKeys.campaigns.all, 'detail'],
    detail: (id) => [...queryKeys.campaigns.details(), id],
  },
  auth: {
    user: ['auth', 'user'],
    session: ['auth', 'session'],
  },
};

// Influencer hooks
export const useInfluencers = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.influencers.list(filters),
    queryFn: () => influencerService.getInfluencers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useInfluencer = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.influencers.detail(id),
    queryFn: () => influencerService.getInfluencer(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useInfluencerSearch = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: queryKeys.influencers.search(searchTerm),
    queryFn: () => influencerService.searchInfluencers(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useListCounts = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.influencers.listCounts(),
    queryFn: () => influencerService.getListCounts(),
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
};

export const useInfluencersByListType = (type, params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.influencers.byListType(type),
    queryFn: () => influencerService.getByListType(type, params),
    enabled: !!type,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useInfluencerCampaigns = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.influencers.campaigns(id),
    queryFn: () => influencerService.getCampaigns(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Campaign hooks
export const useCampaigns = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.campaigns.list(filters),
    queryFn: () => campaignService.getCampaigns(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useCampaign = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => campaignService.getCampaign(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Mutation hooks
export const useAddToList = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: influencerService.addToList,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.influencers.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.influencers.listCounts() });
    },
  });
};

export const useRemoveFromList = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: influencerService.removeFromList,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.influencers.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.influencers.listCounts() });
    },
  });
};

export const useResetLists = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: influencerService.resetLists,
    onSuccess: () => {
      // Invalidate all influencer queries
      queryClient.invalidateQueries({ queryKey: queryKeys.influencers.all });
    },
  });
};

export const useUpdateListStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => influencerService.updateListStatus(id, status),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.influencers.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.influencers.listCounts() });
    },
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: campaignService.createCampaign,
    onSuccess: () => {
      // Invalidate and refetch campaign queries
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => campaignService.updateCampaign(id, data),
    onSuccess: (data, { id }) => {
      // Update the specific campaign in cache
      queryClient.setQueryData(queryKeys.campaigns.detail(id), data);
      // Invalidate campaign lists
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: campaignService.deleteCampaign,
    onSuccess: () => {
      // Invalidate and refetch campaign queries
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
    },
  });
};

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Store auth token
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear auth token
      localStorage.removeItem('authToken');
      // Clear all queries
      queryClient.clear();
    },
  });
};

// Utility hooks
export const useDebouncedQuery = (queryFn, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState('');
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(queryFn);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [queryFn, delay]);
  
  return debouncedValue;
};

// Error handling utility
export const useApiError = (error) => {
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    if (error) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    } else {
      setErrorMessage('');
    }
  }, [error]);
  
  return errorMessage;
}; 