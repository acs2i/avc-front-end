import { useEffect, useState } from "react";

interface Response {
  data: any[],
  total: number
}

export const useActiveInactiveProductGraph = () => {

    const [activeProductTotal, setActiveProductTotal] = useState<number>()
    const [inactiveProductTotal, setInactiveProductTotal] = useState<number>()

    // Number of products of actifs vs inactifs
    useEffect(() => {
        (async () => {
        
         const response: any = await fetch(
           `${
             process.env.REACT_APP_URL_DEV
           }/api/v1/product/search?status=I`,
           {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
             },
           }
         ) as unknown as any;

         const {data, total} = await response.json()
   
         setInactiveProductTotal(total);
         })();
     },[])

         // Number of products of actifs vs inactifs
    useEffect(() => {
      (async () => {
      
       const response = await fetch(
         `${
           process.env.REACT_APP_URL_DEV
         }/api/v1/product/search?status=A`,
         {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
         }
       );

       const { total} = await response.json()

 
       setActiveProductTotal(total);
       })();
    },[])

    return { activeProductTotal, inactiveProductTotal}


}
    