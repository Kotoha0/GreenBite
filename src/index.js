import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import './index.css';
import Home from './components/Home';

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export { default as Home } from './components/Home';
export { CreateRecipe } from './components/CreateRecipe.jsx';
export { Post } from './components/Post.jsx';
export { Like } from './components/Like.jsx';
export { Login } from './components/Login.jsx';
export { UserProfile } from './components/UserProfile.jsx';

if (!crypto.randomUUID) {
  crypto.randomUUID = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  };
}