


export function updateArray(prevSearches:string[] , item:string){    
          if(prevSearches[0] === item) return prevSearches;
    
          const filteredArray = prevSearches.filter(( termino ) => {
            return termino.toLocaleLowerCase() !== item;
          });
          const updateArray = [item, ...filteredArray].slice(0,7);
    
        return updateArray;
}