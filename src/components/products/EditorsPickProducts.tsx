import React from "react";
import EditorsSlider from "./EditorsSlider";
import SectionTitle from "../texts/SectionTitle";

const EditorsPickProducts = async ({
  editorsProducts,
}: {
  editorsProducts: any;
}) => {
  return (
    <>
      <div className="mx-auto flex flex-col justify-center items-center my-40 relative">
        <SectionTitle
          className="pb-10 text-5xl maxmd:text-3xl text-center"
          title={"Selección del Editor"}
          subtitle={
            "Descubre una selección excepcional de categorías cuidadosamente curadas que resaltan la sofisticación en cada detalle. Desde prendas de alta costura hasta accesorios que complementan tu estilo único, sumérgete en un mundo de opciones premium que elevan tu experiencia de moda a nuevas alturas."
          }
        />
        <EditorsSlider editorsProducts={editorsProducts} />;
      </div>
    </>
  );
};

export default EditorsPickProducts;
