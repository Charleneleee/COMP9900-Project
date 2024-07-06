import React from "react";
import { Link } from "react-router-dom";

// Define a functional component named Home
export default function Home() {
  // Render the component
  return (
    // Start of the JSX structure with a div and a class name "title"
    <div className="title">
      {/* Display a paragraph with the text "Under Construction Pages:" */}
      <p>Under Construction Pages:</p>
      
      {/* Link to the "/reset" route with the text "reset page" */}
      <Link to="/reset">Reset Page</Link>
      <br />

      {/* Link to the "/login" route with the text "login page" */}
      <Link to="/login">Login Page</Link>
      <br />

      {/* Link to the "/register" route with the text "register page" */}
      <Link to="/register">Register Page</Link>
      <br />

      {/* Link to the "/main/single" route with the text "single company page" */}
      <Link to="/main/single">Single Company Page</Link>
      <br />

      {/* Link to the "/main/multi" route with the text "multiple company page" */}
      <Link to="/main/multi">Multiple Company Page</Link>
      <br />

      {/* Link to the "/user/profile" route with the text "profile page" */}
      <Link to="/user/profile">Profile Page</Link>
      <br />

      {/* Link to the "/user/history" route with the text "analysis history page" */}
      <Link to="/user/history">Analysis History Page</Link>
    </div>
    // End of the JSX structure
  );
}
