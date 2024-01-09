
import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./Components/SearchBar.js";

function App() {
  const [bookData, setBookData] = useState([]);

  useEffect(() => {
    const fetchDataFromJsonFile = async () => {
      try {
        const response = await fetch(process.env.PUBLIC_URL + "/Data.json");
        const dataFromJsonFile = await response.json();
        setBookData(dataFromJsonFile);
        localStorage.setItem('Data', JSON.stringify(dataFromJsonFile));
      } catch (error) {
        console.error('Error reading data from Data.json:', error);
      }
    };

    fetchDataFromJsonFile();
  }, []);

  const handleSearch = (newData) => {
    setBookData(newData);
  };

  return (
    <div className="App">
      <SearchBar placeholder="Enter a Keyword ..." data={bookData} onSearch={handleSearch} />
    </div>
  );
}

export default App;
