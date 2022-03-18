import { useState, useEffect } from "react";
import axios from 'axios';

export default function useFetch({ url, afterLocalStorageCheck }) {
   const [response, setResponse] = useState(null);
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
     if(afterLocalStorageCheck) {
        axios.get(url).then(res => {
            console.log("SUCCESS", res.data)
            setResponse(res.data)
        }).catch(error => {
            console.log(error)
            setError(error)
        }).finally(() => {
            setIsLoading(false)
        });
     } 
   }, [url, afterLocalStorageCheck]);

   return [ response, error, isLoading ];
}
