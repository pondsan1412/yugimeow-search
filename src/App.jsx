import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [translatedDesc, setTranslatedDesc] = useState('');

  useEffect(() => {
    if (searchTerm.length > 2) { // เริ่มค้นหาเมื่อพิมพ์เกิน 2 ตัวอักษร
      axios
        .get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${searchTerm}`)
        .then((response) => {
          if (response.data.data) {
            setSuggestions(response.data.data);
          } else {
            setSuggestions([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSuggestionClick = (card) => {
    setSearchTerm(card.name);
    setSelectedCard(card);
    translateDesc(card.desc); // เรียกใช้ฟังก์ชันแปลข้อความ
    setSuggestions([]); // เคลียร์ลิสต์เมื่อเลือกชื่อการ์ด
  };

  const translateDesc = (text) => {
    axios
      .post('https://libretranslate.com/translate', {
        q: text,
        source: 'en', // ภาษาแหล่งข้อมูล
        target: 'th', // ภาษาเป้าหมาย
      })
      .then((response) => {
        setTranslatedDesc(response.data.translatedText);
      })
      .catch((error) => {
        console.error("Error translating text:", error);
        setTranslatedDesc('Error translating text');
      });
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Yugimeow Card Search</h1>
        <p>ค้นหาการ์ดจากชื่อการ์ด TCG หรือ OCG</p>
      </header>
      <main>
        <input
          type="text"
          placeholder="ค้นหาการ์ด..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <ul className="suggestions-list">
          {suggestions.map((card) => (
            <li key={card.id} onClick={() => handleSuggestionClick(card)} className="suggestion-item">
              {card.name}
            </li>
          ))}
        </ul>
        {selectedCard && (
          <div className="card-details">
            <img src={selectedCard.card_images[0].image_url} alt={selectedCard.name} className="card-image" />
            <div className="card-info">
              <h2>{selectedCard.name}</h2>
              <p><strong>Type:</strong> {selectedCard.type}</p>
              <p><strong>Description:</strong> {translatedDesc || selectedCard.desc}</p>
              <p><strong>ATK:</strong> {selectedCard.atk}</p>
              <p><strong>DEF:</strong> {selectedCard.def}</p>
              <p><strong>Level:</strong> {selectedCard.level}</p>
              <p><strong>Race:</strong> {selectedCard.race}</p>
              <p><strong>Attribute:</strong> {selectedCard.attribute}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
