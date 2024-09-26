"use client";
import React, { useContext, useEffect, useState } from "react";
import { countries } from "countries-list";
import AuthContext from "@/context/AuthContext";
import { MdCancel } from "react-icons/md";
import Swal from "sweetalert2";

export interface Address {
  _id: string;
  street: string;
  city: string;
  province: string;
  country: string;
  zip_code: string;
  phone: string;
}

const UpdateAddress = ({ id }: { id: any }) => {
  const {
    user,
    getOneAddress,
    updateAddress,
    clearErrors,
    deleteAddress,
    error,
  } = useContext(AuthContext);
  const [address, setAddress] = useState<Address | undefined>();

  useEffect(() => {
    async function getAddress() {
      const addressGet = await getOneAddress(id);
      setAddress(addressGet);
      setStreet(addressGet.street);
      setCity(addressGet.city);
      setProvince(addressGet.province);
      setCountry(addressGet.country);
      setZipcode(addressGet.zip_code);
      setPhone(addressGet.phone);
    }
    getAddress();
  }, [getOneAddress]);

  const countriesList = Object.values(countries);
  const [street, setStreet] = useState(address?.street);
  const [city, setCity] = useState(address?.city);
  const [province, setProvince] = useState(address?.province);
  const [country, setCountry] = useState(address?.country);
  const [zipcode, setZipcode] = useState(address?.zip_code);
  const [phone, setPhone] = useState(address?.phone);

  const address_id = address?._id;

  const deleteHandler = (e: any) => {
    e.preventDefault();
    Swal.fire({
      title: "Estas seguro(a)?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#000",
      confirmButtonText: "¡Sí, eliminar!",
      cancelButtonText: "No, cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado!",
          text: "El Domicilio ha sido eliminado.",
          icon: "success",
        });
        deleteAddress(address_id);
      }
    });
  };

  const submitHandler = (e: any) => {
    e.preventDefault();

    const upAddress = {
      address_id,
      street,
      city,
      province,
      zipcode,
      country,
      phone,
      user,
    };
    updateAddress(upAddress);
  };

  return (
    <>
      <div className="mt-1 mb-20 p-4 md:p-7 mx-auto rounded bg-background shadow-lg max-w-[580px]">
        <form onSubmit={submitHandler}>
          {error && (
            <div
              onClick={clearErrors}
              className="absolute drop-shadow-lg border border-slate-300 top-1/3 left-1/3 bg-background p-10 w-[350px] z-40"
            >
              <MdCancel className="absolute top-2 right-2 text-red-500 cursor-pointer" />
              <h3 className="text-xl text-red-600 ">Error:</h3>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          <h2 className="mb-5 text-2xl font-semibold  font-EB_Garamond">
            Actualizar Dirección
          </h2>

          <div className="mb-4 md:col-span-2">
            <label className="block mb-1"> Calle* </label>
            <input
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              type="text"
              placeholder="Ingresa tu domicilio"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-x-3">
            <div className="mb-4 md:col-span-1">
              <label className="block mb-1"> Ciudad </label>
              <input
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="text"
                placeholder="Ingresa tu Ciudad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="mb-4 md:col-span-1">
              <label className="block mb-1"> Estado </label>
              <input
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="text"
                placeholder="Ingresa tu Estado"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-2">
            <div className="mb-4 md:col-span-1">
              <label className="block mb-1"> Código Postal </label>
              <input
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="number"
                placeholder="Ingresa tu código postal"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
              />
            </div>

            <div className="mb-4 md:col-span-1">
              <label className="block mb-1"> Teléfono </label>
              <input
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="tel"
                placeholder="Ingresa tu teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 md:col-span-2">
            <label className="block mb-1"> País </label>
            <select
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countriesList.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-row justify-between items-center gap-x-6">
            <button
              type="submit"
              className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Actualizar
            </button>
            <button
              onClick={deleteHandler}
              className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              Borrar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateAddress;
