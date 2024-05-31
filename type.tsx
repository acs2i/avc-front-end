export type Card = {
  title: string;
  subtitle: string;
  data1: number[];
  data2: number[];
  labels: string[];
  chartType: string;
};



// Type pour un lien individuel
export type IndividualLink = {
  name: string;
  link: string;
};

// Type pour un groupe de liens
export type LinksGroup = {
  name: string;
  linksGroup: IndividualLink[];
};

// Type pour un groupe de liens dans une catégorie
export type GroupedLink = {
  name: string;
  group?: LinksGroup[];
  linksGroup?: IndividualLink[];
  icon: any;
};

// Type pour une catégorie de liens
export type LinkCategory = {
  name: string;
  linksGroup: GroupedLink[];
};

// Type global pour le tableau de liens
export type Link = {
  linkCategory: LinkCategory[];
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
