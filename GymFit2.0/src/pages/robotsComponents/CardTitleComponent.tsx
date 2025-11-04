
interface Props{
    name:string;
}

export const CardTitleComponent = ({name}:Props) => {
  return (
    <h5 className="card-title text-center">{name}</h5> 
  )
}
