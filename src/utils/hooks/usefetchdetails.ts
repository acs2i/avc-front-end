import { useState, useEffect } from "react";

interface FetchDetailsParams {
  token: string;
  draft: any;
}

interface Supplier {
    supplier_id: string;
    supplier_ref: string;
    pcb: string;
    custom_cat: string;
    made_in: string;
  }
  

export const useFetchDetails = ({ token, draft }: FetchDetailsParams) => {
  const [tagDetails, setTagDetails] = useState<any[]>([]);
  const [brandDetails, setBrandDetails] = useState<any[]>([]);
  const [collectionDetails, setCollectionDetails] = useState<any[]>([]);
  const [supplierDetails, setSupplierDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      return null;
    }
  };

  const fetchAllDetails = async () => {
    if (!draft) return;

    setLoading(true);

    try {
      const tagDetailsPromise = draft.tag_ids.map((tagId: any) =>
        fetchDetail(`${process.env.REACT_APP_URL_DEV}/api/v1/tag/${tagId}`)
      );
      const brandDetailsPromise = draft.brand_ids.map((brandId: any) =>
        fetchDetail(`${process.env.REACT_APP_URL_DEV}/api/v1/brand/${brandId}`)
      );
      const collectionDetailsPromise = draft.collection_ids.map(
        (collectionId: any) =>
          fetchDetail(
            `${process.env.REACT_APP_URL_DEV}/api/v1/collection/${collectionId}`
          )
      );
      const supplierDetailsPromise = draft.suppliers.map((supplier: Supplier) =>
        fetchDetail(
          `${process.env.REACT_APP_URL_DEV}/api/v1/supplier/${supplier.supplier_id}`
        )
      );

      const [
        tagDetailsResult,
        brandDetailsResult,
        collectionDetailsResult,
        supplierDetailsResult,
      ] = await Promise.all([
        Promise.all(tagDetailsPromise),
        Promise.all(brandDetailsPromise),
        Promise.all(collectionDetailsPromise),
        Promise.all(supplierDetailsPromise),
      ]);

      setTagDetails(tagDetailsResult.filter(Boolean));
      setBrandDetails(brandDetailsResult.filter(Boolean));
      setCollectionDetails(collectionDetailsResult.filter(Boolean));
      setSupplierDetails(supplierDetailsResult.filter(Boolean));
    } catch (error) {
      setError("Erreur lors de la récupération des détails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDetails();
  }, [draft]);

  return {
    tagDetails,
    brandDetails,
    collectionDetails,
    supplierDetails,
    loading,
    error,
  };
};
