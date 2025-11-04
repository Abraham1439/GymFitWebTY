import { useNavigate } from "react-router-dom";

import { CardTitleComponent } from "./CardTitleComponent";
import { CardTextComponent } from "./CardTextComponent";

import { capitalizeFirst } from '../../helpers'

import type { robotsProps } from "../../interfaces/robots.interfaces"

interface Props {
    robot:robotsProps;
}

export const CardBodyComponent = ({ robot }:Props) => {

  const navigate = useNavigate();

  const handleShowRobot = ( robot:robotsProps ) => {
    //Pasa el ID en la URL del state
    console.log("Entra en en handleShowRobot");
    navigate(`/robot-component/${robot.id}`);
  }

  return (
    <div className="card-body">
        <CardTitleComponent name={ capitalizeFirst(robot.name) } />        
        <CardTextComponent weapon={ capitalizeFirst(robot.weapon) } />
        <a           
          className="btn btn-primary text-center"
          onClick={ () => {
            handleShowRobot(robot)
          }}
          >
            <i className="fa-solid fa-eye"></i> Ver mas...
          
        </a>
    </div>
  )
}
