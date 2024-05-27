import { useQuery } from "react-query";
import axios from "axios";

export const useFamilies = (
  familyValue: string,
  limit: number,
  currentPage: number
) => {
  return useQuery("families", async () => {
    if (familyValue === "" || familyValue === undefined) {
      return { families: [] };
    }
    const { data } = await axios.get(
      `${process.env.REACT_APP_URL_DEV}/api/v1/family/search?YX_TYPE=LA1&YX_LIBELLE=${familyValue}&page=${currentPage}&limit=${limit}`
    );
    return { families: data.data };
  });
};
