import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

//to create vite inside frontend
//npm init vite@latest . (used dot to create in current folder)--> else it crete a new folder by name you give

//or create the frontend folder using vite (run the vite in root folder of the project) so it can create the frontend folder in root folder

function App() {
  const [jokes, setJokes] = useState([])

  useEffect(() => {
    //dont write /api/api/jokes

    //always wrrite the url that we you want to access(that is in backendn here in backend /api/jokes)--> as we set proxy
    axios.get('/api/jokes')//not need to use .json in axios
    .then( (response)=>{
      setJokes(response.data)
    })
    .catch((error)=>{
      console.log(error)
    })  
    })
    //give error a due to CORS policy(cross origin resource sharing)-->only file from same origin can be accessed
    //mean having same url ,port number 
    //all the thing in url should be same

    //first way to solve this to whitelist the url in backend to it can access the data

    //second way is to use proxy in vite.config.js file
    //'/api': 'http://localhost:3000',
    //by adding the proxy it consider it com form same origin and can access the data


  

  return (
    <>
    <h1>Jokes</h1>
    <p>Jokes: {jokes.lenght}</p>

    {
      //used ( ) so dont have to return
      jokes.map(joke => (
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <p>{joke.content}</p>
        </div>
      ))
    }


    </>
  )
}

export default App
