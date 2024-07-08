export const usePermissions = () => {

    const auth = useAuth();
    
    const route = useRoute();
    
    const name = route.path.split("/")[1];

    const permissions = auth.data.value?.user?.role?.permissions;

    const routePermissions = permissions?.find(x => x.name == name)?.permissions;

    return [routePermissions?.read, routePermissions?.write]
}



export const useNamedPermissions = (section) => {

    const auth = useAuth();
    const permissions = auth.data.value?.user?.role?.permissions;

    const routePermissions = permissions?.find(x => x.name == section)?.permissions;

    return [routePermissions?.read, routePermissions?.write];
}