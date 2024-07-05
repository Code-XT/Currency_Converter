import "./App.css";
import { useState, useEffect } from "react";
import Select from "react-select";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#21272e",
    borderColor: state.isFocused ? "#4D90FE" : "#4B5563",
    borderRadius: "0.375rem",
    borderWidth: "1px",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(66, 153, 225, 0.5)" : "none",
    "&:hover": {
      borderColor: "#4D90FE",
    },
    transition: "all 0.3s",
    input: {
      color: "#fff",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#21272e",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#4D90FE"
      : state.isFocused
      ? "#2C3840"
      : "#21272e",
    color: state.isSelected ? "white" : "#CBD5E0",
    ":hover": {
      backgroundColor: state.isSelected ? "#4D90FE" : "#2C3840",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#CBD5E0",
  }),
};

const Convert = () => {
  const [value, setValue] = useState();
  const [currencies, setCurrencies] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState("usd");
  const [conversionCurrency, setConversionCurrency] = useState("inr");
  const [result, setResult] = useState(null);

  const BASE_URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies`;

  useEffect(() => {
    fetchData();
  }, [baseCurrency, conversionCurrency]);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetch(
        `${BASE_URL}/${baseCurrency.toLowerCase()}.json`
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
      setCurrencies(
        Object.entries(results).map(([key, value]) => ({
          label: `${value ? value : key} (${key.toUpperCase()})`,
          value: key,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBaseCurrencyChange = (selectedOption) => {
    setBaseCurrency(selectedOption.value);
  };

  const handleConversionCurrencyChange = (selectedOption) => {
    setConversionCurrency(selectedOption.value);
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
          <Select
            value={{ label: baseCurrency.toUpperCase(), value: baseCurrency }}
            options={currencies}
            onChange={handleBaseCurrencyChange}
            isSearchable
            placeholder="Select Base Currency"
            styles={customStyles}
          />
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
          <Select
            value={{
              label: conversionCurrency.toUpperCase(),
              value: conversionCurrency,
            }}
            options={currencies}
            onChange={handleConversionCurrencyChange}
            isSearchable
            placeholder="Select Conversion Currency"
            styles={customStyles}
          />
        </div>

        <div className="mb-4">
          <input
            key={result?.date}
            value={
              result ? result[baseCurrency][conversionCurrency] * value : ""
            }
            placeholder="Converted Value"
            type="number"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-300 transition-colors duration-300 w-48"
          />
        </div>

        <div className="mb-4">
          <p>
            <b>{`Exchange Rate: 1 ${baseCurrency.toUpperCase()} = ${
              result ? result[baseCurrency][conversionCurrency] : ""
            } ${conversionCurrency.toUpperCase()}`}</b>
          </p>
          <p>As of {result?.date}</p>
        </div>
      </div>

      <a href="https://objects.githubusercontent.com/github-production-release-asset-2e65be/745992618/2b858607-3e48-47b0-8ce7-347b58b3ff5f?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20240705%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240705T102443Z&X-Amz-Expires=300&X-Amz-Signature=51a639212010949d5b9a991d7f94fc0b1e587d8fa76caabdc16fcfac2ff0382e&X-Amz-SignedHeaders=host&actor_id=73749494&key_id=0&repo_id=745992618&response-content-disposition=attachment%3B%20filename%3DCurrencyCX.zip&response-content-type=application%2Foctet-stream">
        <button className="fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-full shadow-lg">
          Download Extension
        </button>
      </a>

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
