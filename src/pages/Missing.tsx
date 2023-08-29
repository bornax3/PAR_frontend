import { Link } from "react-router-dom";
import { useState } from "react";

const Missing = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <main>
      <h2>Page Not Found</h2>

      <p>Sorry, but the page you were trying to view does not exist.</p>
      {isLogin ? (
        <Link to="/">Visit Our Homepage</Link>
      ) : (
        <Link to="/">Please Login</Link>
      )}
    </main>
  );
};

export default Missing;
