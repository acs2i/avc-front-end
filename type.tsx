export type Link = {
  name: string;
  link: string;
  icon: any;
  showInSidebar: boolean;
  showInBottom: boolean;
};

export type Params = {
  name: string;
  link: string;
  icon: any;
  bg: string;
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

export type Size = {
  value: string;
  label: string;
  name: string;
};

export type Filters_1 = {
  title: string;
};

export type Notifications = {
  user: string;
  message: string;
  date: string;
};

export type Graph = {
  title: string;
  data1: number[];
  data2: number[];
  chart: string;
};

export type MarkerInfo = {
  geocode: [number, number];
  name: string;
}


export type Product = {
  code: string;
  name: string;
  brand: string;
  supplier: string;
  family: string;
  subFamily: string;
  productImg: string;
  creatorName: string;
  creatorImg: string;
  comment: string;
  status: number;
};
