export type Link = {
  name: string;
  link: string;
  icon: any;
  showInSidebar: boolean;
};

export type Suppliers = {
  code: string;
  name: string;
  arobase: string;
};

export type LinkCard = {
  name: string;
  page: string;
};

export type ProductsCreated = {
  id: number;
  ref: string;
  name: string;
  familly: string;
  subFamilly: string;
  brand: string;
  collection: string;
  status: number;
};

export type Filters_1 = {
  title: string;
};
