import { useState, useEffect} from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import axios from 'axios'
import phonebookService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterStr, setFilterStr] = useState('')
  const [notifMsg, setNotifMsg] = useState(null)
  const [notifType, setNotifType] = useState('success')

  useEffect(() => {
    phonebookService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addNewName = (event) => {
    event.preventDefault()

    if (newName.trim() === '' || newNumber.trim() === '') return

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.trim().toLowerCase()
    )

    const personObject = {name: newName, number: newNumber}

    if (existingPerson) {

      updatePerson(existingPerson.id, personObject)
      return
    }

    
    phonebookService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotifMsg(`Person ${personObject.name} added.`)
        setNotifType('success')
        setTimeout(() => {
          setNotifMsg(null)
        }, 5000)
      })

  }

  const handleNameInputChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInputChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterStr(event.target.value)
  }

  const showFiltered = filterStr.trim() === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(filterStr.toLowerCase())
      )

  const removePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if(window.confirm(`Remove ${person.name}?`)) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNotifMsg(`Person ${person.name} removed.`)
          setNotifType('success')
        setTimeout(() => {
          setNotifMsg(null)
        }, 5000)
        })
    }
  }

  const updatePerson = (id, personObject) => {

    if(window.confirm(`${personObject.name} already exists. Update the number?`)) {
      phonebookService
        .update(id, personObject)
        .then((response) => {
          setPersons(prevPersons =>
            prevPersons.map(p => (p.id !== id ? p : response.data) 
            )
          )
          setNewName('')
          setNewNumber('')
          setNotifMsg(`Person ${personObject.name} updated.`)
          setNotifType('success')
          setTimeout(() => {
            setNotifMsg(null)
          }, 5000)
        })
        .catch(error => {
          setNotifMsg(`Person ${personObject.name} has already been removed from the server.`)
          setNotifType('error')
          setTimeout(() => {
            setNotifMsg(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMsg} type={notifType} />
      <Filter filterStr={filterStr} handleFilter={handleFilter}/>
      <h3>add a new</h3>
        <PersonForm
          addNewName={addNewName}
          newName={newName}
          handleNameInputChange={handleNameInputChange}
          newNumber={newNumber}
          handleNumberInputChange={handleNumberInputChange}
          />
      <h3>Numbers</h3>
        <Person showFiltered={showFiltered} removePerson={removePerson} />
    </div>
  )

}

export default App