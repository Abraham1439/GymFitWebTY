

interface Props{
    avatar:string;
    name:string;
}

export const ImgComponent = ({avatar,name}:Props) => {
  return (
    <img 
        src={avatar} 
        className="card-img-top" 
        alt={name} />
  )
}
