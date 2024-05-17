import { useQuery } from "react-query";
import axios from "axios";

export const useSuppliers = (
    supplierValue: string | "",
    currentPage: number
  ) => {
    return useQuery("suppliers", async () => {
      if (supplierValue === "" || supplierValue === undefined) {
        return { suppliers: [] };
      }
  
      const { data } = await axios.get(
        `${process.env.REACT_APP_URL_DEV}/api/v1/supplier/search?T_LIBELLE=${supplierValue}&page=${currentPage}&limit=10`
      );
      return { suppliers: data.data };
    });
  };
  
