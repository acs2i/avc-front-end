import { useEffect, useState } from "react";

interface Response {
  data: any[],
  total: number
}

export const useActiveInactiveSupplierGraph = () => {

    const [activeSupplierTotal, setActiveSupplierTotal] = useState<number>()
    const [inActiveSupplierTotal, setInactiveSupplierTotal] = useState<number>()

    // Number of Suppliers of actifs vs inactifs
    useEffect(() => {
        (async () => {
        
         const response = await fetch(
           `${
             process.env.REACT_APP_URL_DEV
           }/api/v1/supplier/search?status=I`,
           {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
             },
           }
         ) 
         const {total} = await response.json();
   
         setInactiveSupplierTotal(total);
         })();
     },[])

         // Number of Suppliers of actifs vs inactifs
    useEffect(() => {
      (async () => {
      
       const response = await fetch(
         `${
           process.env.REACT_APP_URL_DEV
         }/api/v1/supplier/search?status=A`,
         {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
         }
       )        
       const {total} = await response.json();
       setActiveSupplierTotal(total);
       })();
    },[])

    return { activeSupplierTotal, inActiveSupplierTotal}


}
    