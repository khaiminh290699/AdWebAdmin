import React, { useReducer } from "react";
import { useEffect } from "react/cjs/react.development";
import Api from "../../api";

function usePostHook(){
  const api = new Api();
  const [state, dispatch] = useReducer((state, action) => {
    return {
      ...state,
      ...action.data
    }
  }, {
    errors: [],
    pageProgressing: "search",
    webs: [],
    searchResult: {},
    searchQuery: "",
    pageSearch: 1,
    selectedPosts: [],
    forums: [],
    loadForum: true,
    removeForumPosts: [],
    selectedForums: [],
    refetchSelectForums: true
  });

  useEffect(async () => {
    const webs = await api.listWebs();
    const forums = await api.listForums();
    dispatch({ type: "", data: { webs, forums } })
  }, [])

  return {
    state,
    dispatch
  }
}

export default usePostHook;