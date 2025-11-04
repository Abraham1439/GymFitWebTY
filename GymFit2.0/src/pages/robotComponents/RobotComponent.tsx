import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import type { robotsProps } from "../../interfaces/robots.interfaces";
import { capitalizeFirst } from "../../helpers";
import { getRobotsById } from "../../actions/get-robots-by-id.actions";

export const RobotComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [robot, setRobot] = useState<robotsProps | null>(null);
  const [loading, setLoading] = useState(true);

  const goBack = () => {    
    navigate(-1);
  }

  useEffect(() => {
    if (id) {
      const fetchRobotById = async (robotId: number) => {
        try {
          const robotFound = await getRobotsById(robotId);
          const robot = robotFound.robotABuscar;          
          setRobot(robot || null);
        } catch (error) {
          console.error("❌ Error fetching robot:", error);
          setRobot(null);
        } finally {
          setLoading(false);
        }
      }

      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        fetchRobotById(numericId);
      } else {
        console.error("❌ ID inválido:", id);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [id]);

  // Estado de carga
  if (loading) {
    return (
      <div className="container-fluid bg-black min-vh-100">
        <div className="row">
          <div className="col-12 text-center text-white p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando robot...</p>
          </div>
        </div>
      </div>
    );
  }

  // Validar que robot existe después de la carga
  if (!robot) {
    return (
      <div className="container-fluid bg-black min-vh-100">
        <div className="row">
          <div className="col-12 text-center text-white p-4">
            <h2>Robot no encontrado</h2>
            <p>No se pudo cargar la información del robot.</p>
            <button
              className="btn btn-primary mt-1"
              onClick={goBack}
            >
              <i className="fa-solid fa-backward"></i> Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  const robotName = robot.name ? capitalizeFirst(robot.name) : 'Nombre no disponible';
  const robotAvatar = robot.avatar || '';
  const robotWeapon = robot.weapon ? capitalizeFirst(robot.weapon) : 'No especificado';
  const robotWeakness = robot.weakness ? capitalizeFirst(robot.weakness) : 'No especificado';
  const robotPhrase = robot.phrase || 'Sin frase disponible';
  const robotInfo = robot.info || 'Sin información adicional';

  return (
    <div className="container-fluid bg-black text-white min-vh-100 py-4">      
      <div className="row mb-4">
        <div className="col-12 text-center">
          <button
            className="btn btn-primary"
            onClick={ goBack }
          >
            <i className="fa-solid fa-arrow-left me-2"></i> 
              Volver a la lista
          </button>
        </div>
      </div>

      
      <div className="row align-items-start">        
        <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
          <div className="text-center">
            <img 
              alt={robotName}
              className="img-fluid rounded-3 shadow-lg"
              src={robotAvatar}
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </div>
          <div className="text-center mt-5">
             <h5 className="text-warning mb-3">
                <i className="fa-solid fa-gamepad me-2"></i>
                Sprite
              </h5>
            <img 
              alt={robotName}
              className="img-fluid rounded-3 shadow-lg"
              src={robot.sprite1}
              style={{ maxHeight: '200px', objectFit: 'contain' }}
            />
          </div>
        </div>

        
        <div className="col-lg-6 col-md-12">
          <div className="p-3">
            {/* Nombre del robot */}
            <h1 className="display-4 fw-bold text-primary mb-4">{robotName}</h1>
            
            {/* Serie e ID */}
            <div className="row mb-3">
              <div className="col-sm-6">
                <p className="mb-1"><strong>Juego:</strong><span className="fw-bold text-primary mb-4"> Mega Man : {robot.series} </span></p>
              </div>
              <div className="col-sm-6">
                <p className="mb-1"><strong>ID:</strong> {robot.id}</p>
              </div>
            </div>

            {/* Arma */}
            <div className="mb-3">
              <h5 className="text-warning">
                <i className="fa-solid fa-gun me-2"></i>
                Arma Principal
              </h5>
              <p className="fs-5">{robotWeapon}</p>
            </div>

            {/* Debilidad */}
            <div className="mb-3">
              <h5 className="text-danger">
                <i className="fa-solid fa-shield-heart me-2"></i>
                Debilidad
              </h5>
              <p className="fs-5">{robotWeakness}</p>
            </div>

            {/* Frase característica */}
            <div className="mb-4">
              <h5 className="text-info">
                <i className="fa-solid fa-quote-left me-2"></i>
                Frase
              </h5>
              <blockquote className="blockquote fs-5 fst-italic text-light">
                "{robotPhrase}"
              </blockquote>
            </div>

            {/* Información adicional */}
            <div className="mb-4">
              <h5 className="text-success">
                <i className="fa-solid fa-circle-info me-2"></i>
                Información
              </h5>
              <p className="fs-6 text-light">{robotInfo}</p>
            </div>
          </div>
        </div>
      </div>

      
      {robot.sprite1 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="text-center">
              <h5 className="text-warning mb-3">
                <i className="fa-solid fa-gamepad me-2"></i>
                Sprite
              </h5>
              <img 
                alt={`Sprite de ${robotName}`}
                className="img-fluid rounded"
                src={robot.sprite1}
                style={{ maxHeight: '150px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};