import { Alert } from "@/components/ui/alert";
import React from "react";

// Define a functional component with no props
const Template: React.FC = () => {
  return (
    <div className="border shadow-lg p-5 rounded-lg w-full">
      <Alert>
        <span className="maxsm:text-[10px]">
          Este correo se enviará a todos los clientes seleccionados. Revisa el
          listado en la parte inferior.
        </span>
      </Alert>
    </div>
  );
};

export default Template;
