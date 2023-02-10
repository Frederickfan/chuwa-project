import "./App.css";
import Home from "./components/home";
import React, { useState, useEffect } from "react";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    return () => {
      if (hasError) {
        console.error("An error occurred");
      }
    };
  }, [hasError]);

  try {
    return children;
  } catch (error) {
    setHasError(true);
    return <h1>Something went wrong.</h1>;
  }

};

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Home></Home>
      </ErrorBoundary>
    </div>
  );
}

export default App;
