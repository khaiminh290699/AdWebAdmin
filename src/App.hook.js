import React, { useReducer } from "react";
import { useEffect } from "react/cjs/react.development";
import Api from "./api";

function useAppHook(){
  const api = new Api();
  const [state, dispatch] = useReducer((state, action) => {
    return {
      ...state,
      ...action.data
    }
  }, {
    user: null
  });

  useEffect(async () => {
    const rs = await api.getInfo();

    if (rs.status != 200) {
      alert(rs.message);
      return;
    }
    const { data: { user } } = rs;
    dispatch({ data: { user } })


  }, [])

  return {
    state,
    dispatch
  }
}

export default useAppHook;