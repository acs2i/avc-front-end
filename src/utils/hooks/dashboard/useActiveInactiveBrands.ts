import { useEffect, useState } from "react";

interface Response {
  data: any[],
  total: number
}

export const useActiveInactiveBrandGraph = () => {

    const [activeBrandTotal, setActiveBrandTotal] = useState<number>()
    const [inactiveBrandTotal, setInactiveBrandTotal] = useState<number>()

    // Number of Brands of actifs vs inactifs
    useEffect(() => {
        (async () => {
        
         const response = await fetch(
           `${
             process.env.REACT_APP_URL_DEV
           }/api/v1/brand/search?status=I`,
           {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
             },
           }
         ) 
         const {total} = await response.json();
   
         setInactiveBrandTotal(total);
         })();
     },[])

         // Number of Brands of actifs vs inactifs
    useEffect(() => {
      (async () => {
      
       const response = await fetch(
         `${
           process.env.REACT_APP_URL_DEV
         }/api/v1/brand/search?status=A`,
         {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
         }
       )        
       const {total} = await response.json();
       setActiveBrandTotal(total);
       })();
    },[])

    return { activeBrandTotal, inactiveBrandTotal}


}
    