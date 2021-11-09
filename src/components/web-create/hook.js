import axios from "axios";
import { useEffect, useState } from "react";
import $ from "jquery"
import Api from "../../api";
import slug from "slug";
import { useHistory, useParams } from "react-router";

function useWebCreateHook() {
  const api = new Api();
  const params = useParams();
  const history = useHistory();
  const { id } = params;

  const [state, setState] = useState({
    web_url: null,
    web_name: null,
    frame: false,
    edit: id ? true : false,
    loginActions: [],
    logoutActions: [],
    postActions: [],
    getForumActions: []
  })

  useEffect(async () => {
    const { id } = params;
    if (id) {
      const rs = await api.getOneWeb(id);
      if (rs.status != 200) {
        return;
      }
      const { data: { web, actions } } = rs;
      const { web_url, web_name } = web;
      setState({
        ...state,
        web_url,
        web_name,
        loginActions: actions.filter((action) => action.type === "login"),
        logoutActions: actions.filter((action) => action.type === "logout"),
        postActions: actions.filter((action) => action.type === "posting"),
        getForumActions: actions.filter((action) => action.type === "get_forum"),
      })
    } 
  }, [])

  const action = {
    onURLChange: (event) => {
      setState({ ...state, web_url: event.target.value })
    },

    onNameChange: (event) => {
      setState({ ...state, web_name: event.target.value })
    },

    onCreate: async () => {
      if (!state.web_name && !state.web_url && !state.loginActions.length && !state.logoutActions.length && !state.postActions.length) {
        return;
      }
      if (state.edit) {
        const rs = await api.updateWeb(id, state.web_url, state.web_name, slug(state.web_name, "_"), 
          [
            ...state.loginActions,
            ...state.logoutActions,
            ...state.postActions,
            ...state.getForumActions
          ]
        );
        if (rs.status != 200) {
          alert(rs.message);
          return;
        }
        history.go(0);
        return;
      }
      const rs = await api.createWeb(state.web_url, state.web_name, slug(state.web_name, "_"), 
        [
          ...state.loginActions,
          ...state.logoutActions,
          ...state.postActions,
          ...state.getForumActions
        ]
      );

      if (rs.status != 200) {
        alert(rs.message);
        return;
      }
      history.go(0);
      return;
    }
  }


  return {
    state,
    action,
    setState
  }
}

export default useWebCreateHook;