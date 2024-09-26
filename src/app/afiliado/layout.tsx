import AdminSidebar from "@/components/layout/AdminSidebar";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";

export default function UserLayout({ children }: { children: any }) {
  return (
    <>
      <section className="py-5 sm:py-7 bg-gray-200">
        <div className="container  mx-auto px-4">
          <h1 className="text-bold text-2xl text-foreground  font-EB_Garamond">
            Panel de Control
          </h1>
        </div>
      </section>
      <section className="py-10  maxsm:py-2  bg-slate-100 text-foreground">
        <div className=" mx-auto px-4 maxsm:px-1">
          <div className="flex flex-row maxmd:flex-col ">
            <AffiliateSidebar />
            <main className="w-4/5 maxmd:w-full px-4 maxsm:px-0">
              <article className="border border-gray-200 bg white shadow-md rounded mb-5 px-5 maxmd:px-3">
                {children}
              </article>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
