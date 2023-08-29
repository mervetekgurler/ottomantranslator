import React, { useState } from 'react';
import axios from "axios";
import './App.css';

const App = () => {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");

  const translateText = async () => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `Translate the following Ottoman Turkish text to English:`,
            },
            { role: "user", content: text },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const translatedText = response.data.choices[0].message.content;
      setTranslation(translatedText);
    } catch (error) {
      console.error(error);
      alert("Error occurred during translation");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    translateText();
  };

  return (
    <div className="App">
      <h1>Ottoman Turkish to English Translation</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="text">Text to translate:</label>
        <br />
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          cols={40}
        ></textarea>
        <br />
        <button type="submit">Translate</button>
      </form>
      {translation && (
        <>
          <h2>Translation</h2>
          <p>{translation}</p>
        </>
      )}
    </div>
  );
};

export default App;
