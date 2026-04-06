import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, StyleProfile, WardrobeItem, TrendItem, Outfit } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchProducts(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchProducts(query);
    },
    enabled: !!actor && !isFetching && !!query.trim(),
  });
}

export function useStyleProfile(userId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<StyleProfile | null>({
    queryKey: ['styleProfile', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        return await actor.getStyleProfile(userId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useCreateOrUpdateStyleProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: StyleProfile) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createOrUpdateStyleProfile(profile);
    },
    onSuccess: (_, profile) => {
      queryClient.invalidateQueries({ queryKey: ['styleProfile', profile.userId.toString()] });
    },
  });
}

export function useRemoveSavedOutfit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, index }: { userId: Principal; index: bigint }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.removeSavedOutfit(userId, index);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['styleProfile', userId.toString()] });
    },
  });
}

export function useSaveOutfit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, outfit }: { userId: Principal; outfit: Outfit }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.saveOutfit(userId, outfit);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['styleProfile', userId.toString()] });
    },
  });
}

export function useWardrobe(userId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<WardrobeItem[]>({
    queryKey: ['wardrobe', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getWardrobe(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useAddWardrobeItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, item }: { userId: Principal; item: WardrobeItem }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addWardrobeItem(userId, item);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['wardrobe', userId.toString()] });
    },
  });
}

export function useRemoveWardrobeItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, index }: { userId: Principal; index: bigint }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.removeWardrobeItem(userId, index);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['wardrobe', userId.toString()] });
    },
  });
}

export function useWardrobeSuggestions(userId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['wardrobeSuggestions', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getWardrobeSuggestions(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useTrendingItems() {
  const { actor, isFetching } = useActor();
  return useQuery<TrendItem[]>({
    queryKey: ['trendingItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePersonalizedTrends(userId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<TrendItem[]>({
    queryKey: ['personalizedTrends', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getPersonalizedTrends(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useSeedProducts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      await actor.seedProducts();
      await actor.seedTrendItems();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['trendingItems'] });
    },
  });
}
