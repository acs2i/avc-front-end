import { useQuery } from "react-query";
import axios from "axios";

export const useBrands = (
    brandValue: string | "",
    currentPage: number
  ) => {
    return useQuery("brands", async () => {
      if (brandValue === "" || brandValue === undefined) {
        return { brands: [] };
      }
  
      const { data } = await axios.get(
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand/search?YX_LIBELLE=${brandValue}&page=${currentPage}&limit=10`
      );
      return { brands: data.data };
    });
  };
  
