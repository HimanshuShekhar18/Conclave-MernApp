import { useState, useEffect } from 'react';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/authSlice';


export function useLoadingWithRefresh() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    // useEffect hook 
    /*
    useEffect(()=>{},[]); function and dependencies
    */
    useEffect(() => {
      // server request
        (async () => {
            try {
                const { data } = await axios.get("http://localhost:5500/api/refresh",
                    {
                        withCredentials: true,
                    }
                );
                dispatch(setAuth(data));
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        })();
    }, []);

    return { loading };   // return kar rahe hain loading object;
}