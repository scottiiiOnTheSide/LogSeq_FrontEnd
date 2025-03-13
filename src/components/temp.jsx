import React, { useState } from "react";

const MultiSelectComponent = () => {
  const [title, setTitle] = useState("");
  const [connections, setConnections] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tags, setTags] = useState([]);
  const [showTopics, setShowTopics] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const options = ["Option 1", "Option 2", "Option 3"];

  const handleSelection = (setState, state, value) => {
    setState(state.includes(value) ? state.filter(item => item !== value) : [...state, value]);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchResults(options.filter((opt) => opt.toLowerCase().includes(value.toLowerCase())));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <div>
        <label>Connections: {connections.length > 0 && `${connections.length} selected`}</label>
        <select multiple onChange={(e) => setConnections([...e.target.selectedOptions].map(o => o.value))}>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Subscriptions: {subscriptions.length > 0 && `${subscriptions.length} selected`}</label>
        <select multiple onChange={(e) => setSubscriptions([...e.target.selectedOptions].map(o => o.value))}>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <button onClick={() => setShowTopics(!showTopics)}>
        Topics {topics.length > 0 && `(${topics.length} selected)`}
      </button>
      {showTopics && (
        <div>
          {options.map((opt) => (
            <div key={opt}>
              <input type="checkbox" checked={topics.includes(opt)} onChange={() => handleSelection(setTopics, topics, opt)} />
              {opt}
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setShowTags(!showTags)}>
        Tags {tags.length > 0 && `(${tags.length} selected)`}
      </button>
      {showTags && (
        <div>
          {options.map((opt) => (
            <div key={opt}>
              <input type="checkbox" checked={tags.includes(opt)} onChange={() => handleSelection(setTags, tags, opt)} />
              {opt}
            </div>
          ))}
        </div>
      )}

      <div>
        {!isSearchFocused ? (
          <label onClick={() => setIsSearchFocused(true)}>
            Locations: {selectedLocations.length > 0 && `${selectedLocations.length} selected`}
          </label>
        ) : (
          <input
            type="text"
            placeholder="Search City or Country"
            value={searchTerm}
            onChange={handleSearch}
            onBlur={() => setIsSearchFocused(false)}
            style={{ width: "100%", padding: "8px" }}
          />
        )}
        {isSearchFocused && (
          <div style={{ border: "1px solid #ccc", padding: "5px", background: "white", marginTop: "5px" }}>
            {selectedLocations.map((loc) => (
              <div key={loc}>{loc}</div>
            ))}
            {searchResults.map((result) => (
              <div
                key={result}
                style={{ cursor: "pointer", padding: "5px" }}
                onClick={() => {
                  setSelectedLocations([...selectedLocations, result]);
                  setSearchTerm("");
                }}
              >
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectComponent;
