import React 
from "react";
import "./Search.css";
function Search(props) {
  const { setTextInput, textInput, showData } = props;
  return (
    <div className="header">
      <div>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Search Symbol"
        />
        <button type="submit" onClick={showData}>
          Search
        </button>
      </div>
    </div>
  );
}

export default React.memo(Search);
