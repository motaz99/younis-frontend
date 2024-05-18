import { useQuery } from 'react-query';
import { api } from './Interceptor';

const getElements = async (url, queryParams) => {
  const { data } = await api.get(url, {
    params: queryParams,
  });
  return data;
};

export const useGetQuery = (queryKey, url, queryParams, enabled = true) => {
  return useQuery(queryKey, () => getElements(url, queryParams), {
    refetchOnWindowFocus: false,
    enabled,
  });
};
