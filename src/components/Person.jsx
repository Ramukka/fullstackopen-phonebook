const Person = ({showFiltered, removePerson}) => {
    return(
        <div>
          {showFiltered.map(person => (
            <p key={person.id}>{person.name} {person.number} <button onClick={() => removePerson(person.id)}>remove</button></p>
          ))}
        </div>
    )
}

export default Person