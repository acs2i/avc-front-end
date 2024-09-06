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
  link?: string;
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
  page: string;
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
  _id: string;
  creator_id: any;
  reference: string;
  name: string;
  short_label: string;
  long_label: string;
  type: string;
  tag_ids: any[];
  suppliers: any[];
  dimension_types: string[];
  uvc_ids: any[];
  brand_ids: any[];
  collection_ids: any[];
  imgPath: string;
  peau: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
  status: string;
  additional_fields: any;
}

export type PriceItemSchema = {
  peau: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
}

export type Price = {
  tarif_id: any;
  currency: string;
  supplier_id: any;
  price: PriceItemSchema;
  store: string;
}

export type Uvc = {
  code: string;
  dimensions: string[];
  prices: Price[];
  eans: string[];
  status: string;
  additional_fields: any;
}

export type Supplier = {
  supplier_id: string;
  supplier_ref: string;
  pcb: string;
  custom_cat: string;
  made_in: string;
}

