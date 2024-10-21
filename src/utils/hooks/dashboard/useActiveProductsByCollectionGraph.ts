import { useEffect, useState } from "react";


export const useActiveProductsByCollectionGraph = () => {

    const [activeProductsByCollection, setActiveProductsByCollection] = useState<{}>()

    // Number of Brands of actifs vs inactifs
    useEffect(() => {
        (async () => {
        
         const response = await fetch(
           `${
             process.env.REACT_APP_URL_DEV
           }/api/v1/product/bar-graph-data`,
           {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
             },
           }
         ) 
         const data = await response.json();

         setActiveProductsByCollection(data);
         })();
     },[])



    return { activeProductsByCollection}


}
    