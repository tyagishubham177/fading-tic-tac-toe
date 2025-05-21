// src/components/Lobby.js
import React, { useState, useEffect, useCallback } from "react";

const USERNAMES_STORAGE_KEY = "ticTacToeUsernames";
const MAX_USERNAMES = 5;

const Lobby = ({ createRoom, joinRoom, roomId, setRoomId, username, setUsername }) => {
  const [storedUsernames, setStoredUsernames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load stored usernames on component mount
  useEffect(() => {
    try {
      const rawStoredUsernames = localStorage.getItem(USERNAMES_STORAGE_KEY);
      const parsedUsernames = rawStoredUsernames ? JSON.parse(rawStoredUsernames) : [];
      setStoredUsernames(parsedUsernames);
      if (parsedUsernames.length > 0) {
        setUsername(parsedUsernames[0]); // Pre-fill with the most recent username
      }
    } catch (error) {
      console.error("Failed to load or parse usernames from localStorage", error);
      setStoredUsernames([]);
    }
  }, [setUsername]);

  const saveUsernameToList = useCallback((nameToSave) => {
    if (!nameToSave || nameToSave.trim() === "") return;
    try {
      setStoredUsernames(prevUsernames => {
        let updatedUsernames = [nameToSave.trim(), ...prevUsernames.filter(name => name !== nameToSave.trim())];
        if (updatedUsernames.length > MAX_USERNAMES) {
          updatedUsernames = updatedUsernames.slice(0, MAX_USERNAMES);
        }
        localStorage.setItem(USERNAMES_STORAGE_KEY, JSON.stringify(updatedUsernames));
        return updatedUsernames;
      });
    } catch (error) {
      console.error("Failed to save username to localStorage", error);
    }
  }, []);


  const handleAction = () => {
    if (username && username.trim() !== "") {
      saveUsernameToList(username);
    }
    if (roomId) {
      joinRoom();
    } else {
      createRoom();
    }
    setShowSuggestions(false); // Hide suggestions when action is taken
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filteredSuggestions = storedUsernames.filter(name =>
        name.toLowerCase().startsWith(value.toLowerCase()) && name !== value
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    }
  };

  const handleInputFocus = () => {
    if (username.trim() !== "") {
      const filteredSuggestions = storedUsernames.filter(name =>
        name.toLowerCase().startsWith(username.toLowerCase()) && name !== username
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      // Show all stored usernames if input is empty on focus, limited to MAX_USERNAMES
      setSuggestions(storedUsernames.slice(0,MAX_USERNAMES));
      setShowSuggestions(storedUsernames.length > 0);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click on a suggestion
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const handleSuggestionClick = (suggestion) => {
    setUsername(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm px-4">
      <div className="relative w-full mb-4">
        <input
          id="usernameInput"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-lg"
          autoComplete="off" // Disable browser's default autocomplete
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
            {suggestions.map((name, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(name)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-base sm:text-lg"
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="text"
        placeholder="Enter Room ID (optional)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-lg"
      />
      <button
        className="w-full px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 text-base sm:text-lg"
        onClick={handleAction}
        disabled={!username.trim()} // Disable button if username is empty
      >
        {roomId ? "Join Game" : "Start New Game"}
      </button>
    </div>
  );
};

export default Lobby;
