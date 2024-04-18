export interface Family {
    _id: string;
    name: string;
  }
  
  export interface Collection {
    _id: string;
    name: string;
  }
  
  export interface SubFamily {
    _id: string;
    name: string;
  }
  
  export interface Brand {
    _id: string;
    name: string;
  }
  
  export interface FormData {
    reference: string;
    name: string;
    family: any;
    subFamily: any;
    brand: string;
    productCollection: string;
    uvc: {
      code: string;
      color: any;
      size: any;
      price: any;
    };
    status: number;
    creatorId: any;
  }