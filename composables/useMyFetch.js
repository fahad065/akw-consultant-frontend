export const useMyFetch = (request, opts) => {

  const config = useRuntimeConfig();
  const token = useAuth().token.value;


  return $fetch(request, {
    baseURL: config.public.apiURL,
    method:"GET",
    headers: {
      'Authorization': token
    },

    onResponseError: ({ response }) => {
      if (response.status == 401) {
        auth.signOut({ callbackUrl: '/auth/login' });
      }
    },
    ...opts
  });
};
