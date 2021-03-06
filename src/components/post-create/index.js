import React from "react";
import usePostContext from "./context";
import usePostHook from "./hook";
import GoogleSearch from "../google-search";
import PostForums from "../post-forums";
import ContentEditor from "../content-editor";
import AccountSetting from "../account-setting";
import Progressing from "../progressing";
import { Redirect } from "react-router";

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
      case "content": {
        return <ContentEditor />
      }
      case "account": {
        return <AccountSetting />
      }
      case "progressing": {
        return <Progressing id={state.progressing.id} />
      }
      case "created": {
        return <Redirect to="/post/manage" />
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

