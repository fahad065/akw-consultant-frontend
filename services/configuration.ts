
interface ReplaceKey {
  collection: string;
  field: string;
  fk_id: string;
  key: string;
  label: string;
}
interface inputKeys {
  key: string;
  label: string;
}

interface Email {
  auto_replace_keys: ReplaceKey[];
  cc: string[];
  content: string;
  createdAt: string;
  created_by: string;
  id: string;
  is_deleted: Boolean;
  module: string;
  name: string;
  subject: string;
  to: string[];
  updatedAt: string;
  user_input_keys: inputKeys[];
}


// create form by id 
export const createNewForm = (payload: Object) => {
  return useMyFetch(`forms`, {
    method: "POST",
    body: payload
  });
}


export const updateForm = (id: string, payload: Object) => {
  return useMyFetch(`/forms/${id}`, {
    method: "PATCH",
    body: payload
  });
}

export const getAllForms = (id: string, payload: Object) => {
  return useMyFetch(`/forms`, {
    method: "GET"
  });
}

//get form by id 
export const getFormById = (id: string) => {
  return useMyFetch(`/forms/${id}`, {
    method: "GET",
  });
}


//get form modules
export const getModules = () => {
  return useMyFetch(`/configuration/model`);
}


export const getCollections = (module) => {
  return useMyFetch('/configuration/relatedModels', {
    method: "POST",
    body: { module }
  })
}


//get all form field
export const formCollection = (module: string) => {
  return useMyFetch(`/configuration/keys/${module}/`);
}