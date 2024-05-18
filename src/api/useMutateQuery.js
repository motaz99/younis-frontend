import { useMutation, useQueryClient } from "react-query";
import { api } from "./Interceptor";

export const useMutateQuery = () => {
  const queryClient = useQueryClient();

  const createElement = async ({ url, body, method, headers }) => {
    try {
      const response = await api({
        method,
        url,
        data: body,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };

  return useMutation(createElement, {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
