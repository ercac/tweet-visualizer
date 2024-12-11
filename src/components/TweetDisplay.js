import React from "react";

function TweetDisplay({ tweets }) {
  return (
    <div>
      <ul>
        {tweets.map((tweet) => (
          <li key={tweet.idx}>{tweet.RawTweet}</li>
        ))}
      </ul>
    </div>
  );
}

export default TweetDisplay;
