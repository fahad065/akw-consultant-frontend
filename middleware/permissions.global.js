export default defineNuxtRouteMiddleware((to, from) => {

  const toast = useToast();
  const name = to.path.split("/")[1];

  const [read, _] = useNamedPermissions(name);

  if (!read && typeof (read) != 'undefined') {
    toast.add({
      severity: "error",
      summary: "You can't access this page contact admin",
      life:1500
    })
    return abortNavigation()
  }
});
