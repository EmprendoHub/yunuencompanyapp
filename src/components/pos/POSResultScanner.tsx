import Image from "next/image";

const POSResultScanner = ({
  product,
  variation,
}: {
  product: any;
  variation: any;
}) => {
  return (
    <div className="w-full">
      <section className="mt-5  bg-gray-100">
        <div className=" mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-2 font-EB_Garamond">
            1 Artículo Escaneados
          </h2>
        </div>
      </section>
      <section className="pb-10 bg-gray-100">
        <div className="container  mx-auto bg-background p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <main className="w-full">
              <article className="border border-gray-200  shadow-sm rounded p-3 lg:p-5"></article>
              {/* Items */}
              <article className="border border-gray-200 shadow-sm rounded mb-5 p-3 lg:p-5">
                <div>
                  <div className="flex flex-col maxmd:flex-wrap gap-5 items-center">
                    <div className="block w-[250px] h-[250px] rounded border border-gray-200 overflow-hidden">
                      <Image
                        src={variation?.image}
                        alt="Title"
                        width={500}
                        height={500}
                      />
                    </div>
                    <figcaption className="ml-3">
                      <p>{variation?.title}</p>
                      <p className="font-semibold not-italic">
                        $
                        {variation?.price * variation?.quantity?.toFixed(2) ||
                          1}
                      </p>
                      <p className="mt-1 text-gray-700">
                        Marca: {variation?.brand}
                      </p>
                      <p className="mt-1 text-gray-700">
                        Color: {variation?.color}
                      </p>
                      <p className="mt-1 text-gray-700">
                        Talla: {variation?.size}
                      </p>
                    </figcaption>
                  </div>
                </div>
              </article>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default POSResultScanner;
