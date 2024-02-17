import { RegisterFormData } from "./pages/Register";
import { signInFormData } from "./pages/Signin";
import {hotelType} from "../../backend/src/shared/types"
const API_BASE_URL=import.meta.env.VITE_API_BASE_URL||""
export const register=async(formData:RegisterFormData)=>{
    const response=await fetch(`${API_BASE_URL}/api/users/register`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-type":"application/json",
        },
        body:JSON.stringify(formData)
    })
    const responseBody=await response.json()
    if(!response.ok){
        throw new Error(responseBody.message)
    }
}

export const signin=async(FormData:signInFormData)=>{
    const response=await fetch(`${API_BASE_URL}/api/auth/login`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(FormData)
    })
    const responseBody=await response.json()
    if(!response.ok){
        throw new Error(responseBody.message)
    }
    return responseBody
}

export const validateToken=async()=>{
    const response=await fetch(`${API_BASE_URL}/api/auth/validate-token`,{
        credentials:"include"
    })
    if(!response.ok){
        throw new Error("Token invlaid")
    }
    return response.json()
}
export const signOut=async()=>{
    const response=await fetch(`${API_BASE_URL}/api/auth/logout`,{
        credentials:"include",
        method:"POST"
    })
    if(!response.ok){
        throw new Error("Error DUring signout")
    }
}
export const addMyHotel=async(hotelFormData:FormData)=>{
    const response=await fetch(`${API_BASE_URL}/api/my-hotels`,{
        method:"POST",
        credentials:"include",
        body:hotelFormData
    })
    if(!response.ok){
        throw new Error("Failed to add hotel")
    }
    return response.json()
}
export const fetchMyHotels=async():Promise<hotelType[]>=>{
    const response=await fetch(`${API_BASE_URL}/api/my-hotels`,{credentials:"include"})
    if(!response.ok){
        throw new Error("Error Fetching Hotels")
    }
    return response.json()
}
// export const fetchMyHotels = async (): Promise<hotelType[]> => {
//     const response = await fetch(`${API_BASE_URL}/api/my-hotels`);
//     if (!response.ok) {
//         throw new Error("Error Fetching Hotels");
//     }
//     const data = await response.json();
//     if (!Array.isArray(data)) {
//         throw new Error("Invalid response format: Expected an array");
//     }
//     return data;
// };
