import React, { useState } from 'react';
import axios from "axios";
import './App.css';

const App = () => {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [correctedTranslation, setCorrectedTranslation] = useState("");

  const sendDataToSheet = async (inputText, translatedText, correctedText) => {
  try {
    const response = await axios.post('/api/sheet', {
      inputText,
      translatedText,
      correctedText  // new corrected text parameter
    });
    console.log('Sheet updated successfully', response.data);
  } catch (error) {
    console.error('Failed to update sheet:', error);
    alert('Failed to update sheet');
  }
};
  
  
  
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
      sendDataToSheet(text, translatedText);
    } catch (error) {
      console.error(error);
      alert("Error occurred during translation");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    translateText();
  };

  const handleOpenModal = () => {
  setCorrectedTranslation(translation); // Prepopulate with the translation
  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);
};

const handleSaveCorrection = () => {
  sendDataToSheet(text, translation, correctedTranslation);
  setShowModal(false);
};


return (
  <div className="App">
    <h1>Ottoman Turkish to English Translation</h1>
    <p>This website uses OpenAI's GPT-4 API to translate Ottoman Turkish sentences into English. Please enter a sentence (up to 50 words) to get its English translation instantly.</p>
    <p>Please correct the translation after it appears on the screen by clicking the 'Edit This Translation' button.</p>
    <form onSubmit={handleSubmit}>
      <label htmlFor="text">Text to translate:</label>
      <textarea id="text" value={text} onChange={(e) => setText(e.target.value)} rows={5} cols={40}></textarea>
      <button type="submit">Translate</button>
    </form>
    {translation && (
      <>
        <h2>Translation</h2>
        <p>{translation}</p>
        <button onClick={handleOpenModal}>Edit This Translation</button>
      </>
    )}
    {showModal && (
      <div className="modal">
        <div className="modal-content">
          <textarea value={correctedTranslation} onChange={(e) => setCorrectedTranslation(e.target.value)} rows={5} cols={50}></textarea>
          <button onClick={handleSaveCorrection}>Save Correction</button>
          <button onClick={handleCloseModal}>Close</button>
        </div>
      </div>
    )}
  </div>
);
};
  
export default App;
