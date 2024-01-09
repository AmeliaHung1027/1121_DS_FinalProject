// AIzaSyC64YNRCPQPoI3MIXHWM4i--rW8fh4RehI
// AIzaSyB-kM5TWkZZRmLE-K3-3ob9_yqz2Biqm9k
// AIzaSyBd51cZ75VKyx4vHWvvBwbaO4JqhNG6qTE

import React, { useState, useEffect } from "react";
import "./SearchBar.css";

function SearchBar({ placeholder, data, title, subtitle, onSearch }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(0);

  const handleFilter = (event) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
    const searchWords = event.target.value.replace(/^\s+/, '').split(/\s+/);
    setWordEntered(searchWords);

    const newFilter = filterData(data, searchWords);
    updateFilteredData(newFilter);
  };

  const updateFilteredData = (newFilter) => {
    if (wordEntered.length === 0) {
      setFilteredData([]);
    } else {
      newFilter.sort((a, b) => calculateTotalScore(b) - calculateTotalScore(a));
      setFilteredData(newFilter);
    }
  };

  const calculateTotalScore = (value) => {
    return wordEntered.reduce((total, word) => {
      const weight = getWeight(word);
      return total + weight * ((value.content && value.content.split(word).length - 1) || 0);
    }, 0);
  };

  const getWeight = (word) => {
    const weights = {
      '食物': 5,
      '在地': 5,
      '台灣': 10,
      '食品': 5,
      '食譜': 1,
      '餐廳': 1,
      '無麩質': 5,
      '料理': 1,
      '菜單': 1,
    };
    return weights[word] || 0;
  };

  const handleSearch = async () => {
    if (wordEntered.length > 0) {
      try {
        const results = await search(wordEntered.join(' ')+"台灣無麩質");
        const existingData = JSON.parse(localStorage.getItem('Data')) || [];
        const newData = existingData.concat(results);
        localStorage.setItem('Data', JSON.stringify(newData));
        if (onSearch) {
          onSearch(newData);
        }
        console.log('Search results stored successfully!');
        console.log('Stored Data:', newData);
      } catch (error) {
        console.error('Error during search:', error);
      }
    }
  };

  const handleButtonClick = () => {
    handleSearch();
    updateFilter();
  };

  const updateFilter = () => {
    const searchWords = wordEntered.join(' ').replace(/^\s+/, '').split(/\s+/);
    setWordEntered(searchWords);
    const newFilter = filterData(data, searchWords);
    updateFilteredData(newFilter);
    setUpdateFlag((prev) => prev + 1);
  };

  useEffect(() => {
    console.log("Filtered Data updated:", filteredData);
  }, [updateFlag, filteredData]);

  return (
    <div className="search">
      <div className="searchTitles">
        <h2>The Gluten Escape</h2>
        <h3>Immerse in a realm of gluten-free delights—savor exquisite flavors, uncover inspired recipes, and navigate a curated haven tailored for your gluten-free lifestyle.</h3>
      </div>
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered.join(' ')}
          onChange={handleFilter}
        />
        <button onClick={handleButtonClick} className="B">搜尋</button>
      </div>
      {filteredData.length !== 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            const totalScore = calculateTotalScore(value);

            return (
              <a className="dataItem" href={value.link} target="_blank" rel="noreferrer" key={key}>
                <p>
                  {value.title} -
                  {wordEntered.map((word, index) => (
                    <span key={index}>
                      {index > 0 && ', '}
                      {`${word}: ${(value.content && value.content.split(word).length - 1) || 0}`}
                    </span>
                  ))}
                  - 總評分: {totalScore}
                </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

async function search(query) {
  const API_KEY = 'AIzaSyBd51cZ75VKyx4vHWvvBwbaO4JqhNG6qTE';
  const CX = '65c4d9d66a8dd4234';
  const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CX}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.items.slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      content: item.snippet,
    }));
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
}

function filterData(data, searchWords) {
  return data.filter((value) => {
    const allMatches = searchWords.every((word) =>
      value.title.includes(word) || (value.content && value.content.includes(word))
    );
    return allMatches;
  });
}

export default SearchBar;