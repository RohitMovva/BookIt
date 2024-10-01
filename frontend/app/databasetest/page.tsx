// pages/index.tsx or app/page.tsx

"use client"; // This line marks the component as a Client Component

import { useState, useEffect } from "react";
import axios from "axios";

interface Item {
  id: string;
  name: string;
}

const HomePage = () => {
  const [message, setMessage] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial message from Flask
    axios
      .get("http://127.0.0.1:5000/test")
      .then((response) => {
        setMessage(response.data.message || "No message received");
      })
      .catch((error) => {
        console.error("Error fetching test message:", error);
        setError("Error fetching test message from backend.");
      });

    // Fetch items from the Flask backend
    axios
      .get("http://127.0.0.1:5000/items")
      .then((response) => {
        setItems(response.data.items || []);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setError("Error fetching items from backend.");
      });
  }, []);

  const addItem = () => {
    if (newItem) {
      axios
        .post("http://127.0.0.1:5000/items", { name: newItem })
        .then((response) => {
          setItems((prevItems) => [...prevItems, response.data.item]);
          setNewItem("");
        })
        .catch((error) => {
          console.error("Error adding item:", error);
          setError("Error adding new item.");
        });
    }
  };

  const deleteItem = (itemId: string) => {
    axios
      .delete(`http://127.0.0.1:5000/items/${itemId}`)
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setError("Error deleting item.");
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Flask Backend Test</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>{message ? `Message from Flask: ${message}` : "Loading..."}</p>

      <div>
        <h2>Items</h2>
        <ul>
          {items.length > 0 ? (
            items.map((item) => (
              <li key={item.id}>
                {item.name}
                <button onClick={() => deleteItem(item.id)}>Delete</button>
              </li>
            ))
          ) : (
            <p>No items available.</p>
          )}
        </ul>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New Item Name"
        />
        <button onClick={addItem}>Add Item</button>
      </div>
    </div>
  );
};

export default HomePage;
