import React, { useState } from "react";
import Quiz from "./Quiz";

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = () => {
    if (isLogin) {
      // Login
      const storedUser = JSON.parse(localStorage.getItem("users")) || {};
      if (storedUser[username] && storedUser[username] === password) {
        setUser(username);
        localStorage.setItem("user", username);
      } else {
        alert("Invalid credentials!");
      }
    } else {
      // Signup
      const storedUser = JSON.parse(localStorage.getItem("users")) || {};
      if (storedUser[username]) {
        alert("User already exists!");
      } else {
        storedUser[username] = password;
        localStorage.setItem("users", JSON.stringify(storedUser));
        alert("Signup successful! Please login now.");
        setIsLogin(true);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4">
      {!user ? (
        <div className="card max-w-md w-full animate-fadeIn">
          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            BrainBuzz
          </h1>
          <input
            type="text"
            placeholder="Username"
            className="input w-full mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input w-full mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleAuth} className="btn-primary w-full mb-3">
            {isLogin ? "Login" : "Signup"}
          </button>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="btn-ghost w-full"
          >
            {isLogin
              ? "Don't have an account? Signup"
              : "Already have an account? Login"}
          </button>
        </div>
      ) : (
        <Quiz onLogout={handleLogout} />
      )}
    </div>
  );
}
