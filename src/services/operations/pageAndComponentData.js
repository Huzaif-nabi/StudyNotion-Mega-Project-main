import { toast } from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

// Corrected function name typo: getCatalogaPageData -> getCatalogPageData
export const getCatalogPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = null; // Initialize as null for better error checking
  try{
        // 1. Changed method from "POST" to "GET"
        // 2. Appended categoryId to the URL
        // 3. Removed the request body
        const response = await apiConnector("GET", `${catalogData.CATALOGPAGEDATA_API}/${categoryId}`);

        if(!response?.data?.success) {
            throw new Error("Could not Fetch Category page data");
        }
        
        result = response?.data;

  }
  catch(error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}