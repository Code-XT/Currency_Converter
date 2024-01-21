import "./App.css";
import { useState, useEffect } from "react";

const SwitchCurrency = () => (
  <svg
    className="svg-icon"
    style={{
      width: "1em",
      height: "1em",
      verticalAlign: "middle",
      fill: "currentColor",
      overflow: "hidden",
    }}
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M448 774.4v192l-448-320h1024v128H448z m-448-512h576v-192l448 320H0v-128z"
      fill="##03479c"
    />
  </svg>
);

const Convert = () => {
  const [value, setValue] = useState();
  const [currencies, setCurrencies] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState("usd");
  const [conversionCurrency, setConversionCurrency] = useState("inr");
  const [result, setResult] = useState(null);

  const BASE_URL = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies`;

  useEffect(() => {
    fetchData();
  }, [baseCurrency, conversionCurrency]);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetch(
        `${BASE_URL}/${baseCurrency.toLowerCase()}/${conversionCurrency.toLowerCase()}.json`
      );

      if (!data.ok) {
        throw new Error("Failed to fetch data");
      }

      const rates = await data.json();
      setResult(rates);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const data = await fetch(`${BASE_URL}.min.json`);

      if (!data.ok) {
        throw new Error("Failed to fetch data");
      }

      const results = await data.json();
      setCurrencies(results);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBaseCurrencyChange = (e) => {
    setBaseCurrency(e.target.value);
  };

  const handleConversionCurrencyChange = (e) => {
    setConversionCurrency(e.target.value);
  };

  const handleSwitch = () => {
    setBaseCurrency(conversionCurrency);
    setConversionCurrency(baseCurrency);
  };

  return (
    <>
      <header className="bg-blue-500 text-white py-4 text-center">
        <div className="container mx-auto">
          <h1 className="text-3xl font-extrabold">
            Currency Converter <sub>CX</sub>
          </h1>
          <h3>Includes Most Common Cryptos</h3>
        </div>
      </header>

      <div className="flex items-center justify-center mt-8 flex-col">
        <div className="mb-4">
          <select
            value={baseCurrency}
            onChange={handleBaseCurrencyChange}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-300 transition-colors duration-300"
          >
            {currencies &&
              Object.entries(currencies).map(([key, value]) => (
                <option key={key} value={key}>
                  {`${value ? value : key} (${key.toUpperCase()})`}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <input
            type="number"
            value={value}
            onChange={handleChange}
            placeholder="Enter Value"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-300 transition-colors duration-300 w-48"
          />
        </div>

        <div className="mb-4">
          <button
            onClick={handleSwitch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition-colors duration-300"
          >
            <SwitchCurrency />
          </button>
        </div>

        <div className="mb-4">
          <select
            value={conversionCurrency}
            onChange={handleConversionCurrencyChange}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-300 transition-colors duration-300"
          >
            {currencies &&
              Object.entries(currencies).map(([key, value]) => (
                <option key={key} value={key}>
                  {`${value ? value : key} (${key.toUpperCase()})`}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <input
            key={result?.date}
            value={result?.[conversionCurrency] * value}
            placeholder="Converted Value"
            type="number"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-300 transition-colors duration-300 w-48"
          />
        </div>

        <div className="mb-4">
          <p>
            <b>{`Exchange Rate: 1 ${baseCurrency.toUpperCase()} = ${
              result?.[conversionCurrency]
            } ${conversionCurrency.toUpperCase()}`}</b>
          </p>
          <p>As of {result?.date}</p>
        </div>
      </div>

      <footer className="bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-4 text-center">
        <div className="container mx-auto">
          <p>&copy; 2024 Currency Converter. All rights reserved.</p>
          <a href="https://github.com/Code-XT" target="_blank">
            <p>@CodeX</p>
          </a>
        </div>
      </footer>
    </>
  );
};

export default Convert;
