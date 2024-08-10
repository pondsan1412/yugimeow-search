import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

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
    setSuggestions([]); // เคลียร์ลิสต์เมื่อเลือกชื่อการ์ด
  };

  return (
    <>
      <div>
        <h1>Yugimeow Card Search</h1>
        <p>ค้นหาการ์ดจากชื่อการ์ด TCG หรือ OCG</p>
        <input
          type="text"
          placeholder="ค้นหาการ์ด..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {suggestions.map((card) => (
            <li key={card.id} onClick={() => handleSuggestionClick(card)}>
              {card.name}
            </li>
          ))}
        </ul>
        {selectedCard && (
          <div>
            <h2>{selectedCard.name}</h2>
            <p><strong>Type:</strong> {selectedCard.type}</p>
            <p><strong>Description:</strong> {selectedCard.desc}</p>
            <p><strong>ATK:</strong> {selectedCard.atk}</p>
            <p><strong>DEF:</strong> {selectedCard.def}</p>
            <p><strong>Level:</strong> {selectedCard.level}</p>
            <p><strong>Race:</strong> {selectedCard.race}</p>
            <p><strong>Attribute:</strong> {selectedCard.attribute}</p>
            <img src={selectedCard.card_images[0].image_url} alt={selectedCard.name} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
