import { useEffect, useState } from "react";

interface Response {
  data: any[],
  total: number
}

export const useActiveInactiveUvcGraph = () => {

    const [activeUvcTotal, setActiveUvcTotal] = useState<number>()
    const [inactiveUvcTotal, setInactiveUvcTotal] = useState<number>()

    // Number of Uvcs of actifs vs inactifs
    useEffect(() => {
        (async () => {
        
         const response = await fetch(
           `${
             process.env.REACT_APP_URL_DEV
           }/api/v1/uvc/search?status=I`,
           {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
             },
           }
         ) 
         const {total} = await response.json();
   
         setInactiveUvcTotal(total);
         })();
     },[])

         // Number of Uvcs of actifs vs inactifs
    useEffect(() => {
      (async () => {
      
       const response = await fetch(
         `${
           process.env.REACT_APP_URL_DEV
         }/api/v1/uvc/search?status=A`,
         {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
         }
       )        
       const {total} = await response.json();
       setActiveUvcTotal(total);
       })();
    },[])

    return { activeUvcTotal, inactiveUvcTotal}


}
    