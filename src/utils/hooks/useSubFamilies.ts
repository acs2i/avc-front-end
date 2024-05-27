import { useQuery } from "react-query";
import axios from "axios";

export const useSubFamilies = (subFamilyValue: string, currentPage: number) => {
  return useQuery("subFamilies", async () => {
    if (subFamilyValue === "" || subFamilyValue === undefined) {
      return { subFamilies: [] };
    }
    const { data } = await axios.get(
      `${process.env.REACT_APP_URL_DEV}/api/v1/family/search?YX_TYPE=LA2&YX_LIBELLE=${subFamilyValue}&page=${currentPage}&limit=10`
    );
    return { subFamilies: data.data };
  });
};
