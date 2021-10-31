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
    refetchSelectForums: true,
    content: "",
    title: "",
    uploadedFiles: [],
    accountSettings: [],
    progressing: {}
  });

  useEffect(async () => {
    const rs = await api.listWebs();

    if (rs.status != 200) {
      return;
    }
    const { data: { webs } } = rs;

    const rsf = await api.listForums();

    if (rsf.status != 200) {
      return;
    }
    const { data: { forums } } = rsf;

    dispatch({ type: "", data: { webs, forums } })

    window.addEventListener("beforeunload", async (event) => {
      event.preventDefault();
      if (state.uploadedFiles.length) {
        await api.removeFileApi(state.uploadedFiles);
      }
    })

  }, [])

  return {
    state,
    dispatch
  }
}

export default usePostHook;