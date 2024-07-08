export const myFetch = (request, opts) => {

  const config = useRuntimeConfig();
  const token = useAuth().token.value;


  return $fetch(request, {
    baseURL: config.public.apiURL,
    headers: {
      'Authorization': token
    },

    onResponseError: ({ response }) => {
      if (response.status == 401) {
        auth.signOut({ callbackUrl: '/auth/login' });
      }
      if (response.status == 412) {
        //:todo - roles
      }
    },
    ...opts
  });
};
