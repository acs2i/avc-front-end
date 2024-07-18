import { useQuery } from "react-query";
import axios from "axios";

interface Product {
  _id: string;
  GA_CODEARTICLE: number;
  GA_FERME: string;
  GA_FOURNPRINC: number;
  GA_LIBCOMPL: string;
  GA_LIBELLE: string;
  GA_LIBREART1: any;
  GA_LIBREART2: any;
  GA_LIBREART4: any;
  family: any;
  subFamily: any;
  brand: any;
  productCollection: string;
  imgPath: string;
}
interface SearchParams {
  codeValue?: string;
  labelValue?: string;
  brandChoiceValue?: string;
  supplierChoiceValue?: string;
  familyChoiceValue?: string;
  subFamilyChoiceValue?: string;
}

export const useProducts = (
  limit: number,
  currentPage: number,
  searchParams?: SearchParams
) => {
  const isSearching = Boolean(
    searchParams?.codeValue ||
    searchParams?.labelValue ||
    searchParams?.brandChoiceValue ||
    searchParams?.supplierChoiceValue ||
    searchParams?.familyChoiceValue ||
    searchParams?.subFamilyChoiceValue
  );

  return useQuery(
    ["products", { limit, currentPage, searchParams }],
    async () => {
      const url = isSearching
        ? `${process.env.REACT_APP_URL_DEV}/api/v1/product/search`
        : `${process.env.REACT_APP_URL_DEV}/api/v1/product`;

      const { data } = await axios.get(url, {
        params: {
          GA_CODEARTICLE: searchParams?.codeValue,
          GA_LIBELLE: searchParams?.labelValue,
          GA_LIBREART4: searchParams?.brandChoiceValue,
          GA_FOURNPRINC: searchParams?.supplierChoiceValue,
          GA_LIBREART1: searchParams?.familyChoiceValue,
          GA_LIBREART2: searchParams?.subFamilyChoiceValue,
          page: currentPage,
          limit
        }
       
      });

      const products = data.data;
      const total = data.total;
      return { products, total };
    },
    {
      keepPreviousData: true,
    }
  );
};
