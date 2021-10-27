import React, { useContext, useEffect } from "react";
import { useState } from "react/cjs/react.development";

import useAppHook from "../../App.context"
import Api from "../../api";

function usePostManageHook() {
  const api = new Api();

  const context = useContext(useAppHook);

  const [ state, setState ] = useState({
    isLoading: true,
    posts: [],
    mode: null,
    page: 1,
    total: 0
  })

  useEffect(async () => {
    const rs = await api.listPosts([], {}, state.page, value.limit, state.mode);
    if (rs.status != 200) {
      return;
    }
    const { data: { posts, total } } = rs;
    setState({ ...state, total, posts, isLoading: false });
  }, []);

  const action = {
    onAdminModeChange: async (checked) => {
      setState({...state, isLoading: true})
      state.page = 1;
      if (checked === true) {
        state.mode = "admin";
        return;
      } else {
        state.mode = null;
      }
      const rs = await api.listPosts([], {}, state.page, value.limit, state.mode)
      if (rs.status != 200) {
        return;
      }
      const { data: { posts, total } } = rs;
      setState({ ...state, posts,total , isLoading: false });
    }
  }

  const value = {
    limit: 5
  }

  return {
    context: context.state,
    state,
    action,
    value
  }
}

export default usePostManageHook;