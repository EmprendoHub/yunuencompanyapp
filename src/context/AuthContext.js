"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { createContext, useState } from "react";

function isDuplicateRecordError(response) {
  return (
    response.status === 500 &&
    response.data.includes("E11000 duplicate key error")
  );
}

function extractDuplicateKey(response) {
  const match = response.data.match(
    /index: (\w+)_\d+ dup key: { (\w+): "(.*?)" }/
  );
  return match ? { index: match[1], key: match[2], value: match[3] } : null;
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [updated, setUpdated] = useState(null);

  const router = useRouter();

  const registerUser = async ({ name, email, password }) => {
    try {
      const { data } = await fetch(`/api/register`, {
        name,
        email,
        password,
      });

      if (data?.email) {
        router.push("/login");
      }

      if (data === "User already exists") {
        setError(data);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const registerAffiliateUser = async (newAffiliate) => {
    try {
      const { data } = await axios.post(`/api/affiliate/register`, {
        newAffiliate,
      });

      if (data) {
        router.push("/registro/affiliate/stripe");
      }
    } catch (error) {
      console.log(error?.response?.data);
      setError(error?.response?.data);
    }
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      const url = "/api/auth/session?update";
      // Make the get request
      const data = await axios.get(url);
      //const data = await response.json();

      // Use the `data` as needed
      if (data?.data?.user) {
        setUser(data?.data?.user);
        router.refresh();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clearErrors = () => {
    setError(null);
  };

  const updateProfile = async (formData) => {
    // Make the fetch request
    try {
      setLoading(true);
      // Construct the payload in the desired format
      const payload = {
        title: formData.get("name"),
        _id: formData.get("_id"),
        email: formData.get("email"),
        image: formData.get("image"),
      };

      const response = await axios.put(
        `/api/profile/update`,
        {
          payload,
        },
        {
          headers: {
            "X-Mysession-Key": JSON.stringify(user),
          },
        }
      );
      if (response) {
        setLoading(false);
        return NextResponse.json(
          {
            message: "Se actualizo el usuario Exitosamente ",
          },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteProfile = async (id) => {
    try {
      const { data } = await axios.delete(`/api/client?${id}`, {
        headers: {
          "X-Mysession-Key": JSON.stringify(user),
        },
      });
      if (data) {
        router.push("/admin/clientes");
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const getAllPosts = async (searchParams, nextCookies) => {
    const urlParams = {
      keyword: searchParams.keyword,
      page: searchParams.page,
    };
    // Filter out undefined values
    const filteredUrlParams = Object.fromEntries(
      Object.entries(urlParams).filter(([key, value]) => value !== undefined)
    );
    const searchQuery = new URLSearchParams(filteredUrlParams).toString();
    const URL = `/api/posts?${searchQuery}`;
    try {
      const { data } = await axios.get(
        URL,
        {
          headers: {
            Cookie: nextCookies,
          },
        },
        { cache: "no-cache" }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async (formData) => {
    // Make the fetch request
    try {
      // Create a new FormData object
      const formDataObject = new FormData();
      // Append each form field to the FormData object
      for (const [key, value] of formData.entries()) {
        formDataObject.append(key, value);
      }

      // Construct the payload in the desired format
      const payload = {
        title: formDataObject.get("title"),
        category: formDataObject.get("category"),
        images: formDataObject.get("images"),
        summary: formDataObject.get("summary"),
        content: formDataObject.get("content"),
        createdAt: formDataObject.get("createdAt"),
      };
      const response = await axios.post(
        `/api/post`,
        {
          payload,
        },
        {
          headers: {
            "X-Mysession-Key": JSON.stringify(user),
          },
        }
      );
      if (response) {
        setLoading(false);
        return NextResponse.json(
          {
            message: "Se creo La Publicación Exitosamente ",
          },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updatePost = async (formData) => {
    // Make the fetch request
    try {
      // Create a new FormData object
      const formDataObject = new FormData();
      // Append each form field to the FormData object
      for (const [key, value] of formData.entries()) {
        formDataObject.append(key, value);
      }

      // Construct the payload in the desired format

      const payload = {
        title: formDataObject.get("title"),
        category: formDataObject.get("category"),
        images: formDataObject.get("images"),
        summary: formDataObject.get("summary"),
        content: formDataObject.get("content"),
        updatedAt: formDataObject.get("updatedAt"),
        _id: formDataObject.get("_id"),
      };

      const response = await axios.put(`/api/post`, {
        payload,
      });
      if (response) {
        setLoading(false);
        return NextResponse.json(
          {
            message: "Se actualizo La Publicación Exitosamente ",
          },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deletePost = async (id) => {
    try {
      const { data } = await axios.delete(`/api/post?${id}`, {
        headers: {
          "X-Mysession-Key": JSON.stringify(user),
        },
      });
      if (data) {
        router.push("/admin/blog");
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const updateProduct = async (formData) => {
    // Make the fetch request
    try {
      // Create a new FormData object
      const formDataObject = new FormData();
      // Append each form field to the FormData object
      for (const [key, value] of formData.entries()) {
        formDataObject.append(key, value);
      }

      // Construct the payload in the desired format
      const payload = {
        title: formDataObject.get("title"),
        description: formDataObject.get("description"),
        category: formDataObject.get("category"),
        cost: formDataObject.get("cost"),
        price: parseInt(formDataObject.get("price"), 10), // Convert to integer
        sizes: formDataObject.get("sizes"),
        images: formDataObject.get("images"),
        featured: formDataObject.get("featured"),
        brand: formDataObject.get("brand"),
        gender: formDataObject.get("gender"),
        salePrice: formDataObject.get("salePrice"),
        salePriceEndDate: formDataObject.get("salePriceEndDate"),
        stock: formDataObject.get("stock"),
        _id: formDataObject.get("_id"),
      };

      const response = await axios.put(
        `/api/product`,
        {
          payload,
        },
        {
          headers: {
            "X-Mysession-Key": JSON.stringify(user),
          },
        }
      );
      if (response) {
        setLoading(false);
        return NextResponse.json(
          {
            message: "Se creo el Producto Exitosamente ",
          },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addNewReferralLink = async (newLink) => {
    try {
      const { data } = await axios.post(
        `/api/affiliate/createlink`,
        {
          newLink,
          user,
        },
        {
          headers: {
            "X-Mysession-Key": JSON.stringify(user),
          },
        }
      );

      if (data) {
        router.push("/perfil/enlaces");
      }
    } catch (error) {
      // Check if it's a duplicate record error
      if (isDuplicateRecordError(error?.response)) {
        const duplicateKeyInfo = extractDuplicateKey(error?.response);
        if (duplicateKeyInfo) {
          const { index, key, value } = duplicateKeyInfo;
          setError(
            `Ya existe un registro con ${
              key && key === "phone" ? "telefono" : "domicilio"
            }: "${value}". Por favor, ingrese un valor único.`
          );
        }
      }
    }
  };

  const getAllAffiliateLinks = async (currentCookies) => {
    try {
      const URL = `/api/affiliate/referrallinks`;
      const { data } = await axios.get(
        URL,
        {
          headers: {
            Cookie: currentCookies,
          },
        },
        { cache: "no-cache" }
      );

      return data;
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const getUserFavorites = async (favoritesData, session) => {
    try {
      const stringSession = JSON.stringify(session);
      const stringFavorites = JSON.stringify(favoritesData);
      const URL = `/api/client`;
      const { data } = await axios.get(URL, {
        headers: {
          Session: stringSession,
          Favorites: stringFavorites,
        },
      });
      return data;
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  const updateAddress = async (address) => {
    try {
      const { data } = await axios.put(
        `/api/address`,
        {
          address,
        },
        {
          headers: {
            "X-Mysession-Key": JSON.stringify(user),
          },
        }
      );

      if (data) {
        setUpdated(true);
        router.replace(`/perfil/direccion/${id}`);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const { data } = await axios.delete(`/api/address?${id}`, {
        headers: {
          "X-Mysession-Key": JSON.stringify(user),
        },
      });
      if (data) {
        router.push("/perfil/direcciones");
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const getOneAddress = async (id) => {
    try {
      const URL = `/api/address?${id}`;
      const { data } = await axios.get(URL);
      return data;
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const updateOrder = async (formData) => {
    try {
      // Create a new FormData object
      const formDataObject = new FormData();
      // Append each form field to the FormData object
      for (const [key, value] of formData.entries()) {
        formDataObject.append(key, value);
      }

      const id = formDataObject.get("_id");

      // Construct the payload in the desired format
      const payload = {
        orderStatus: formDataObject.get("orderStatus"),
        _id: id,
      };
      const response = await axios.put(`/api/order`, {
        payload,
      });

      if (response) {
        setLoading(false);
        return NextResponse.json(
          {
            message: "Se creo actualizo el pedido Exitosamente ",
            payload,
          },
          { status: 200 }
        );
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loading,
        updated,
        setUser,
        registerUser,
        updateProfile,
        clearErrors,
        getOneAddress,
        updateAddress,
        setUpdated,
        deleteAddress,
        deleteProfile,
        updateProduct,
        createPost,
        updatePost,
        deletePost,
        updateOrder,
        getAllPosts,
        addNewReferralLink,
        getAllAffiliateLinks,
        registerAffiliateUser,
        getUserFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
