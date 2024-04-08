interface FormData {
  [key: string]: any;
}

interface StorageData {
  [key: string]: {
    [key: string]: FormData;
  };
}

const STORAGE_KEY = 'AVC';
const EXPIRES_IN_HOURS = 48;

const getStorageData = (): StorageData => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

const setStorageData = (data: StorageData) => {
  const now = new Date();
  const expirationDate = new Date(now.getTime() + EXPIRES_IN_HOURS * 60 * 60 * 1000);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, expirationDate }));
};

const clearStorageData = (email?: string, formName?: string, pageName?: string) => {
  const data = getStorageData();

  if (email) {
    delete data[email];
  } else if (formName) {
    Object.keys(data).forEach((key) => {
      delete data[key][formName];
    });
  } else if (pageName) {
    Object.keys(data).forEach((key) => {
      Object.keys(data[key]).forEach((formKey) => {
        if (data[key][formKey].pageName === pageName) {
          delete data[key][formKey];
        }
      });
    });
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }

  setStorageData(data);
};

const getFormData = (email: string, formName: string, pageName: string): FormData => {
  const data = getStorageData();
  return data[email]?.[formName]?.pageName === pageName ? data[email][formName].formData : {};
};

const setFormData = (email: string, formName: string, pageName: string, formData: FormData) => {
  const data = getStorageData();
  data[email] = data[email] || {};
  data[email][formName] = { pageName, formData };
  setStorageData(data);
};

export { getFormData, setFormData, clearStorageData };