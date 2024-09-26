import React from "react";
import { useSelector } from "react-redux";

export const QRToPrint = () => {
  const { productsData } = useSelector((state: any) => state.compras);
  return (
    <div className="p-5">
      <table className="table">
        <thead>
          <tr>
            <td>#</td>
            <td>Name</td>
            <td>Price</td>
            <td>Qty</td>
            <td>Total</td>
          </tr>
        </thead>
        <tbody>
          {productsData
            ? productsData.map((cartProduct: any, key: any) => (
                <tr key={key}>
                  <td>{cartProduct.id}</td>
                  <td>{cartProduct.name}</td>
                  <td>{cartProduct.price}</td>
                  <td>{cartProduct.quantity}</td>
                  <td>{cartProduct.totalAmount}</td>
                </tr>
              ))
            : ""}
        </tbody>
      </table>
      <h2 className="px-2">Total Amount: $0</h2>
    </div>
  );
};
