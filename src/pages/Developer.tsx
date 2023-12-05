import { useNavigate } from "react-router-dom";
import "../css/Developer.css";

const Developer = () => {
  const navigate = useNavigate();

  const handleNavigation = (destination: string) => {
    switch (destination) {
      case "ustanove":
        navigate("/schools");
        break;
      case "admini":
        navigate("/admins");
        break;
      case "profesori":
        navigate("/professors");
        break;
      case "kriteriji":
        navigate("/files");
        break;
      default:
        navigate("/developer");
        break;
    }
  };

  return (
    <div className="content-developer">
      <div className="card-grid">
        <a className="card" onClick={() => handleNavigation("ustanove")}>
          Škole
        </a>
        <a className="card" onClick={() => handleNavigation("admini")}>
          Admini
        </a>
        <a className="card" onClick={() => handleNavigation("profesori")}>
          Profesori
        </a>
        <a className="card" onClick={() => handleNavigation("kriteriji")}>
          Kriteriji
        </a>
      </div>
    </div>
  );
};

export default Developer;
