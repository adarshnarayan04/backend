import { useEffect, useState } from "react";

import "./App.css";
import axios from "axios";

function App() {
  //---- we use it various time so we create an function

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false); //to know whether data is loading or not
  const [search, setSearch] = useState("");
  useEffect(() => {
    //can  not write useEffect(async () => { as it is hook

    const controller = new AbortController();//so that we can cancel the request(as when we type a single letter it create an new rerquest)

    //use async await in axios so it do not go to next line until it get the response

    //if use IIFE use ; before it ( to prevent from error) --> as it require previous statement to end with ;
    //so we put ; before IIFE to prevent from error if we forget to put ; after previous statement
    (async () => {
      try {
        setLoading(true);
        setError(false); //if error become true then it remain true forever --> so we set it false before every request
        const response = await axios.get("/api/products?search=" + search,{
          signal:controller.signal//cancel the old the request and send it to catch( so have to handle it differently in catch)
          //as it not an error it is due to cancel if the api request ( so setError should be not set by this )
        }); //as use app.get in backend so have to use get here also
        console.log(response);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        if(axios.isCancel(error)){//get called when the axios request is cancelled
          console.log("Request Cancelled",error.message);
          return;// so that setError is not called 
          //as it not an error ,it is due to cancel if the api request
        }
        setError(true);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();

    //cleanup code(when it is unmounted --> means it depency chagnes then new useEffect will be called and the old one will be unmounted)
    //then this code will run

    return () => {
      controller.abort();//abort the request
    }
  }, [search]);//ADDED search in dependency array(so that it get new data when search changes)

  //const [products,error,loading]= customReactQuery("/api/products");

  // if (error) {
  //   //only the first return statement will be executed( so in case of error it will return this and stop the execution)
  //   //main  return statement will not be executed
  //   return <h1>Something went wrong</h1>;
  // }
  // if (loading) {
  //   return <h1>Loading...</h1>;
  // }

  //now using one return statement and doind condtional rendering

  return (
    <>
      <h1>Adarsh Narayan</h1>
      <input
        type="text"
        placeholder="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading && <h1>Loading...</h1>}
      {error && <h1>Something went wrong</h1>}
      <h2>Number of Products:{products.length}</h2>
    </>
  );
}

export default App;

const customReactQuery = (urlPath) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false); //to know whether data is loading or not
  const [search, setSearch] = useState("");
  useEffect(() => {
    //can  not write useEffect(async () => { as it is hook

    //use async await in axios so it do not go to next line until it get the response

    //if use IIFE use ; before it ( to prevent from error) --> as it require previous statement to end with ;
    //so we put ; before IIFE to prevent from error if we forget to put ; after previous statement
    (async () => {
      try {
        setLoading(true);
        setError(false); //if error become true then it remain true forever --> so we set it false before every request
        const response = await axios.get(urlPath); //as use app.get in backend so have to use get here also
        console.log(response);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [search]);

  return [products, error, loading, search, setSearch];
};
