
import { CardBodyComponent } from "./CardBodyComponent";
import type { robotsProps } from "../../interfaces/robots.interfaces"

interface Props{
    robots:robotsProps[];
}


export const CardComponent = ({ robots }:Props) => {


  const robotsArray = Array.isArray(robots) ? robots : [robots]

    return (
    <>
      {
        robotsArray.map((robot) => (
          <div key={robot.id} className="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-12 mb-4 mt-2">
            <div 
              className="card h-100 text-white"
              style={{
                backgroundColor: 'rgba(33, 37, 41, 0.7)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <img src={robot.avatar} 
                className="card-img-top" 
                alt={robot.name} 
                style={{
                  height: '300px',
                  objectFit: "contain"
                }}
              />
              <CardBodyComponent robot={robot} />
            </div>
          </div>
        ))}
    </>
  )
}
