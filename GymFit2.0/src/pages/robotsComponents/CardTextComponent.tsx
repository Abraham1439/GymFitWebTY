
interface Props {
    weapon:string;
}

export const CardTextComponent = ({weapon}:Props) => {
  return (
    <p className="card-text text-center text-warning"><i className="fa-solid fa-gun me-2"></i>{ weapon }</p>
  )
}
