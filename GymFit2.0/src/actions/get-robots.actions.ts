import type { robotsAllProps } from '../interfaces/robots.interfaces';

export const getRobots = async():Promise<robotsAllProps> => {
    
    const response = await fetch(`https://repaso-node.onrender.com/`);

    if(!response.ok){
        throw new Error(`Error HTTP: ${response.status}`);
    }
    const data:robotsAllProps = await response.json();
    
    return data;
}