import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import ForceLayout from "./components/ForceLayout";
import TweetDisplay from "./components/TweetDisplay";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [colorBy, setColorBy] = useState("Sentiment");
  const [selectedTweets, setSelectedTweets] = useState([]);

  const handleFileUpload = (jsonData) => {
    const updatedData = jsonData.map((item, idx) => ({
      ...item,
      idx,
      fixed: false, 
    }));
    setData(updatedData);
  };

  const handleColorByChange = (value) => {
    setColorBy(value);
  };

  const handleTweetSelection = (tweet) => {
    setSelectedTweets((prev) =>
      prev.some((t) => t.idx === tweet.idx)
        ? prev.filter((t) => t.idx !== tweet.idx)
        : [tweet, ...prev]
    );

    setData((prevData) =>
      prevData.map((d) =>
        d.idx === tweet.idx ? { ...d, fixed: !d.fixed } : d
      )
    );
  };

  return (
    <div className="app">
      <header>
        <h1>Upload a JSON file</h1>
        <FileUpload onFileUpload={handleFileUpload} />
        <select
          value={colorBy}
          onChange={(e) => handleColorByChange(e.target.value)}
        >
          <option value="Sentiment">Sentiment</option>
          <option value="Subjectivity">Subjectivity</option>
        </select>
      </header>
      <main>
        {data.length > 0 ? (
          <>
            <ForceLayout
              data={data}
              colorBy={colorBy}
              onTweetClick={handleTweetSelection}
              selectedTweets={selectedTweets}
            />
            <TweetDisplay tweets={selectedTweets} />
          </>
        ) : (
          <p></p>
        )}
      </main>
    </div>
  );
}

export default App;
