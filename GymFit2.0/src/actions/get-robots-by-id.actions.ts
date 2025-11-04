import type { robotIdProps } from "../interfaces/robots.interfaces";

export const getRobotsById = async(id:number) => {

    const response = await fetch(`https://repaso-node.onrender.com/${id}`);

    if(!response.ok){
        throw new Error(`Error HTTP: ${response.status}`);
    }
    const data:robotIdProps = await response.json();    

    return data;
}