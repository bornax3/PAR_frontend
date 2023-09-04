import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate("/");

  return (
    <section>
      <h1>Unauthorized</h1>
      <br />
      <p>You are not authorized to view this page.</p>
      <button onClick={goBack}>Go Back</button>
    </section>
  );
};

export default Unauthorized;
