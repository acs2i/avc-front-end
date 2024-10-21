import { useEffect, useState } from "react"
import { useActiveInactiveProductGraph } from "./useActiveInactiveProductGraphs"
import {
    Card,
  } from "@/type";
import { useActiveInactiveUvcGraph } from "./useActiveInactiveUvcGraph";
import useActiveInactiveNoEansUvcGraph from "./useActiveInactiveNoEansUvc";
import { useActiveInactiveBrandGraph } from "./useActiveInactiveBrands";
import { useActiveInactiveSupplierGraph } from "./useActiveInactiveSupplierGraph";
import { useActiveProductsByCollectionGraph } from "./useActiveProductsByCollectionGraph";


const useCardsHook = () => {

    const [cards, setCards] = useState<Card[]>([])
    const [isLoadingCards, setIsLoadingCards] = useState<boolean>(true)

    const { activeBrandTotal, inactiveBrandTotal} = useActiveInactiveBrandGraph()
    const { activeProductTotal, inactiveProductTotal} = useActiveInactiveProductGraph()
    const { activeUvcTotal, inactiveUvcTotal} = useActiveInactiveUvcGraph();
    const  { activeNoEansUvcTotal, inactiveNoEansUvcTotal} = useActiveInactiveNoEansUvcGraph()
    const { activeSupplierTotal, inActiveSupplierTotal} = useActiveInactiveSupplierGraph()
    const { activeProductsByCollection} = useActiveProductsByCollectionGraph()

    useEffect(() => {

        if(activeProductTotal !== undefined  && inactiveProductTotal !== undefined ) {
            // make sure we don't double the card
            const doesExist: number = cards.findIndex((c: Card) => c.id === 0);

            if(doesExist === -1) {
                const c: Card =   {
                    id: 0,
                    title: "Produits",
                    subtitle: "Actif vs. Inactif",
                    data1: [activeProductTotal, inactiveProductTotal],
                    labels: ["Actif", "Inactif"],
                    chartType: "pie",
                  };
    
                setCards([...cards, c])
            }
        
        }

    }, [activeProductTotal, inactiveProductTotal])

    useEffect(() => {
        if(activeUvcTotal !== undefined && inactiveUvcTotal !== undefined ) {
            const doesExist: number = cards.findIndex((c: Card) => c.id === 1);
            
            if(doesExist === -1) {
                const c: Card =   {
                    id: 1,
                    title: "UVC",
                    subtitle: "Actif vs. Inactif",
                    data1: [activeUvcTotal, inactiveUvcTotal],
                    labels: ["Actif", "Inactif"],
                    chartType: "pie",
                  };
    
                setCards([...cards, c])
            }
        }

    }, [activeUvcTotal, inactiveUvcTotal])

    useEffect(() => {
        if(activeNoEansUvcTotal !== undefined && inactiveNoEansUvcTotal !== undefined ) {
            const doesExist: number = cards.findIndex((c: Card) => c.id === 2);
            
            if(doesExist === -1) {
                console.log("h")

                const c: Card =   {
                    id: 2,
                    title: "UVC",
                    data1: [activeNoEansUvcTotal, inactiveNoEansUvcTotal],
                    subtitle: "Actifs avec/sans EAN",
                    labels: ["Avec EAN", "Sans EAN"],
                    chartType: "pie",
                  };
    
                setCards([...cards, c])
            }
        }

    }, [activeNoEansUvcTotal, inactiveNoEansUvcTotal])

    useEffect(() => {

        if(activeBrandTotal !== undefined  && inactiveBrandTotal !== undefined ) {
            // make sure we don't double the card
            const doesExist: number = cards.findIndex((c: Card) => c.id === 3);

            if(doesExist === -1) {
                const c: Card =   {
                    id: 3,
                    title: "Marques",
                    subtitle: "Actif vs. Inactif",
                    data1: [activeBrandTotal, inactiveBrandTotal],
                    labels: ["Actif", "Inactif"],
                    chartType: "pie",
                  };
    
                setCards([...cards, c])
            }
        
        }

    }, [activeBrandTotal, inactiveBrandTotal])

    useEffect(() => {

        if(activeSupplierTotal !== undefined  && inActiveSupplierTotal !== undefined ) {
            // make sure we don't double the card
            const doesExist: number = cards.findIndex((c: Card) => c.id === 4);

            if(doesExist === -1) {
                const c: Card =   {
                    id: 4,
                    title: "Fournisseurs",
                    subtitle: "Actif vs. Inactif",
                    data1: [activeSupplierTotal, inActiveSupplierTotal],
                    labels: ["Actif", "Inactif"],
                    chartType: "pie",
                  };
    
                setCards([...cards, c])
            }
        
        }

    }, [activeSupplierTotal, inActiveSupplierTotal])

    useEffect(() => {

        const doesExist: number = cards.findIndex((c: Card) => c.id === 5);

        if(doesExist === -1) {

            const data1: number[] = []
            if(activeProductsByCollection) {
                for(const entry of Object.values(activeProductsByCollection as any)) {
                    data1.push(entry as unknown as number)
                }
                const labels = []
                for(const entry of Object.keys(activeProductsByCollection as any)) {
                    labels.push(entry)
                }
                
    
                const c: Card =   {
                    id: 5,
                    title: "Produits",
                    subtitle: "Actifs par Collection",
                    data1,
                    labels,
                    chartType: "bar",
                  };
        
                setCards([...cards,c])
            }


        }


    }, [activeProductsByCollection])

    // useEffect(() => {
    //     console.log("C: " , activeProductsByCollection)

    //     if(activeProductsByCollection !== undefined ) {
    //         // make sure we don't double the card
    //         const doesExist: number = cards.findIndex((c: Card) => c.id === 5);

    //         if(doesExist === -1) {
    //             const c: Card =   {
    //                 id: 5,
    //                 title: "La Totale de Commandes",
    //                 subtitle: "Actif vs. Inactif",
    //                 data1: [activeProductsByCollection],
    //                 labels: ["Actif", "Inactif"],
    //                 chartType: "bar",
    //               };
    
    //             setCards([...cards, c])

    //         }
        
    //     }

    // }, [activeProductsByCollection])



    // check to see if we should finally show cards
    useEffect(() => {
        if(cards.length === 6) {
            setIsLoadingCards(false)
        }
    },[cards])

    return {cards, isLoadingCards}
}


export default useCardsHook