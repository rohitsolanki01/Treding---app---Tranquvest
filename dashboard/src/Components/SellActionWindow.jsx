import React, { useState,useContext } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./SellActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const { closeSellWindow } = useContext(GeneralContext);

  const handleSellClick = async () => {
    try {
      const response = await axios.post("http://localhost:8080/sellorder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "SELL",
      });
      console.log("Sell order successful:", response.data);
      closeSellWindow();
    } catch (error) {
      console.error("Error creating sell order:", error);
      alert("Failed to create sell order. Please try again.");
    }
  };

  return (
    <div className="container" id="sell-window">
      <div className="regular-order">
        <fieldset>
          <legend>Qty.</legend>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(Number(e.target.value))}
          />
        </fieldset>
        <fieldset>
          <legend>Price</legend>
          <input
            type="number"
            step="0.05"
            value={stockPrice}
            onChange={(e) => setStockPrice(Number(e.target.value))}
          />
        </fieldset>
      </div>

      <div className="buttons">
        <span>Margin released ₹140.65</span>
        <div>
          <button className="btn btn-red" onClick={handleSellClick}>
            Sell
          </button>
          <button className="btn btn-grey" onClick={closeSellWindow}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
