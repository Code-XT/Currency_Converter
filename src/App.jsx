import "./App.css";
import { useState, useEffect } from "react";
import Select from "react-select";

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
      fill="#03479c"
    />
  </svg>
);

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: state.isFocused ? "#4D90FE" : "#4B5563",
    borderRadius: "0.375rem",
    borderWidth: "1px",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(66, 153, 225, 0.5)" : "none",
    "&:hover": {
      borderColor: "#4D90FE",
    },
    transition: "all 0.3s",
    color: "#e0e4e7",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "rgba(77, 144, 254, 0.5)"
      : state.isFocused
      ? "rgba(77, 144, 254, 0.3)"
      : "rgba(255, 255, 255, 0.15)",
    color: state.isSelected ? "white" : "#e0e4e7",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#e0e4e7",
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
      <div className="container">
        <div className="glass-card">
          <header>
            <h1 className="header-title">
              Currency Converter <sub>CX</sub>
            </h1>
            <h3 className="sub-title">Includes Most Common Cryptos</h3>
          </header>

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
                result &&
                result[baseCurrency] &&
                result[baseCurrency][conversionCurrency]
                  ? result[baseCurrency][conversionCurrency] * value
                  : ""
              }
              placeholder="Converted Value"
              type="number"
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-300 transition-colors duration-300 w-48"
            />
          </div>

          <div className="mb-4">
            <p>
              <b>{`Exchange Rate: 1 ${baseCurrency.toUpperCase()} = ${
                result &&
                result[baseCurrency] &&
                result[baseCurrency][conversionCurrency]
                  ? result[baseCurrency][conversionCurrency]
                  : ""
              } ${conversionCurrency.toUpperCase()}`}</b>
            </p>
            <p>As of {result?.date}</p>
          </div>
        </div>
      </div>

      <a href="https://github.com/Code-XT/Currency_Converter-ChromeExtension/releases/download/v1.1.0/CurrencyCX.zip">
        <button className="download-button">Download Extension</button>
      </a>

      <footer>
        <p>&copy; 2024 Currency Converter. All rights reserved.</p>
        <a href="https://github.com/Code-XT" target="_blank">
          @CodeX
        </a>
      </footer>
    </>
  );
};

export default Convert;
