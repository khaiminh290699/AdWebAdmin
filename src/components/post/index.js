import React from "react";
import usePostContext from "./context";
import usePostHook from "./hook";
import GoogleSearch from "../google-search";
import PostForums from "../post-forums";

function PostCreate() {
  const { state, dispatch } = usePostHook();
  const progressing = () => {
    switch(state.pageProgressing) {
      case "search": {
        return <GoogleSearch />
      }
      case "forums": {
        return <PostForums />
      }
    }
  }
  return <>
    <usePostContext.Provider value={{ state, dispatch }}>
      { progressing() }
    </usePostContext.Provider>
  </>
}

export default PostCreate;

