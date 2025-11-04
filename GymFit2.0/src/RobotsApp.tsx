
import { useCallback, useEffect , useState } from 'react';

import { NavBar , CardComponent } from './pages/robotsComponents';

import { getRobots , getRobotsByName } from './actions';
         
import type { robotsProps } from './interfaces/robots.interfaces';

import 'bootstrap/dist/css/bootstrap.min.css'

export const RobotsApp = () => {


  const [ robots , setRobots ] = useState<robotsProps[]>([]);
  const [ allRobots , setAllRobots ] = useState<robotsProps[]>([]);

  useEffect(()=> {

    const fetchData = async() => {
      try{

        const data = await getRobots();
        const robots = data.robots;
        setRobots(robots);
        setAllRobots(robots);

      }catch(error){
        console.log(`Error en fetchin data: ${ error }`);
      }
    }

    fetchData();

  },[]);

  const handleSearch = useCallback(async(query:string) => {
    query = query.trim().toLowerCase()

    if(query.length === 0){
      setRobots(allRobots);
      return
    }

    try{

      const wantedRobot = await getRobotsByName(query);
      if(wantedRobot.robot){
        setRobots([wantedRobot.robot])
      }
      return

    }catch(error){
      console.log(`Error en: ${error}`);
    }

  },[allRobots])
  
  
  return (
    <div 
      className="container-fluid min-vh-100"
      style={{
        backgroundImage: 'url("/react.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >      
      <div className="row">
        <NavBar onQuery={handleSearch} />        
        <CardComponent robots={robots} />
      </div>
    </div>
  )
}
