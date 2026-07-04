import { useEffect } from 'react';
import { useOptionsStore } from '../stores/optionsStore';

export function useOptions() {
  const skills = useOptionsStore((state) => state.skills);
  const neighborhoods = useOptionsStore((state) => state.neighborhoods);
  const isLoading = useOptionsStore((state) => state.isLoading);
  const isSearchingNeighborhoods = useOptionsStore((state) => state.isSearchingNeighborhoods);
  const error = useOptionsStore((state) => state.error);
  const fetchOptions = useOptionsStore((state) => state.fetchOptions);
  const searchNeighborhoods = useOptionsStore((state) => state.searchNeighborhoods);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return { skills, neighborhoods, isLoading, isSearchingNeighborhoods, error, searchNeighborhoods };
}