export type Card = {
  id: number
  title: string;
  subtitle: string;
  data1: number[];
  data2?: number[];
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


export type SupplierDetail = {
  index: number;
  code: string;
  company_name: string;
  supplier_id: string;
  supplier_ref: string;
  pcb: string;
  custom_cat: string;
  made_in: string;
}

export type TagDetail = {
  _id: string;
  name: string;
  code: string;
}

export type BrandDetail = {
  _id: string;
  label: string;
}

export type CollectionDetail = {
  _id: string;
  label: string;
}

export type Tag = {
  _id: string;
  level: string;
  code: string;
  name: string;
};

export type Product = {
  _id: string;
  creator_id: any;
  reference: string;
  alias: string;
  short_label: string;
  long_label: string;
  type: string;
  tag_ids: any[];
  suppliers: any[];
  dimension_types: string[];
  uvc_ids: any[];
  brand_ids: any[];
  collection_ids: any[];
  blocked?: string;
  height: string;
  width: string;
  length: string;
  comment: string;
  size_unit: string;
  weigth_unit: string;
  gross_weight: string;
  net_weight: string;
  imgPath: string;
  paeu: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
  status: string;
  additional_fields: any;
}

export type Draft = {
  _id: string;
  creator_id: any;
  reference: string;
  alias: string;
  short_label: string;
  long_label: string;
  type: string;
  tag_ids: string[];
  brand_ids: string[];
  collection_ids: string[];
  paeu: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
  height: string;
  width: string;
  length: string;
  comment: string;
  size_unit: string;
  weigth_unit: string;
  gross_weight: string;
  net_weight: string;
  imgPath: string;
  status: string;
  step: number;
  additional_fields: any;
  suppliers: SupplierDetail[];
  dimension_types: string[];
  uvc?: any[];
  tag_details?: TagDetail[];
  brand_details?: BrandDetail[];
  collection_details?: CollectionDetail[];
}

export type PriceItemSchema = {
  paeu: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
}

export type Price = {
  supplier_id: any;
  price: PriceItemSchema;
}

export type Uvc = {
  code: string;
  dimensions: string[];
  prices: Price;
  eans: string[];
  ean: string;
  collectionUvc: string;
  barcodePath: string;
  status: string;
  blocked?: string;
  height?: string;
  width?: string;
  length?: string;
  gross_weight?: string;
  net_weight?: string; 
}

interface CustomField {
  label: string;
  value: string;
  field_type?: string;
}

export type DatalakeUvc = {
  product_id: any;
  code: string;
  dimensions: string[];
  prices: Price;
  ean: string;
  eans: string[];
  collectionUvc: string;
  status: string;
  blocked?: string;
  barcodePath: string;
  height?: string;
  width?: string;
  length?: string;
  gross_weight?: string;
  net_weight?: string; 
  additional_fields?: CustomField[];
}

export type Supplier = {
  supplier_id: string;
  supplier_ref: string;
  pcb: string;
  custom_cat: string;
  made_in: string;
  company_name: string; 
}

export type TagOption = {
  _id: string;
  name: string;
  value: string;
  label: string;
};

export type BrandOption = {
  _id: string;
  value: string;
  label: string;
  code: string;
};

export type CollectionOption = {
  _id: string;
  value: string;
  label: string;
  code: string;
};

export type SuppliersOption = {
  _id: string;
  value: string;
  label: string;
  company_name: string;
  supplier_ref?: string;  // Champs optionnels
  pcb?: string;
  custom_cat?: string;
  made_in?: string;
  supplier_id: string;
};


