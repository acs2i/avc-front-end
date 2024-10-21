import { useEffect, useState } from "react";



export const useActiveInactiveNoEansUvcGraph = () => {

    const [activeNoEansUvcTotal, setActiveNoEansUvcTotal] = useState<number>()
    const [inactiveNoEansUvcTotal, setInactiveNoEansUvcTotal] = useState<number>()

    // Number of Uvcs of actifs vs inactifs
    useEffect(() => {
        (async () => {
        
         const response = await fetch(
           `${
             process.env.REACT_APP_URL_DEV
           }/api/v1/uvc/search?eans%5B%5D=%7B%22length%22%3A%7B%22%24eq%22%3A0%7D%7D&status=A`,
           {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
             },
           }
         ) 
         

         const {total} = await response.json();


         setActiveNoEansUvcTotal(total);

         })();
     },[])

         // Number of Uvcs of actifs vs inactifs
    useEffect(() => {
      (async () => {
      
       const response = await fetch(
         `${
           process.env.REACT_APP_URL_DEV
         }/api/v1/uvc/search?eans%5B%5D=%7B%22length%22%3A%7B%22%24eq%22%3A0%7D%7D&status=I`,
         {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
         }
       ) 
       
       const {total} = await response.json();

       setInactiveNoEansUvcTotal(total);

       })();
    },[])

    return { activeNoEansUvcTotal, inactiveNoEansUvcTotal}


}
    

export default useActiveInactiveNoEansUvcGraph