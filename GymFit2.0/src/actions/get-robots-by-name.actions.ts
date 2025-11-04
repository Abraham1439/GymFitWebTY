import type { robotNameProps } from '../interfaces/robots.interfaces';

export const getRobotsByName = async(query:string):Promise<robotNameProps> => {
    

    const encodedName = encodeURIComponent(query).replace(/20%/g,'+');

    const response = await fetch(`https://repaso-node.onrender.com/name/${encodedName}`);

    if(!response.ok){
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const data:robotNameProps = await response.json();

    return data;
}