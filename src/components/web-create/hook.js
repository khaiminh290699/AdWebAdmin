import axios from "axios";
import { useEffect, useState } from "react";
import $ from "jquery"
import Api from "../../api";
import slug from "slug";
import { useHistory, useParams } from "react-router";
import { Button, Space, Typography } from "antd";

const { Text, Link } = Typography;

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
    getForumActions: [],
    forums: [],
    updateForum: null,
    forum_name: null,
    forum_url: null,
  })

  useEffect(async () => {
    const { id } = params;
    if (id) {
      const rs = await api.getOneWeb(id);
      if (rs.status != 200) {
        return;
      }
      const { data: { web, actions, forums } } = rs;
      const { web_url, web_name } = web;
      setState({
        ...state,
        web_url,
        web_name,
        loginActions: actions.filter((action) => action.type === "login"),
        logoutActions: actions.filter((action) => action.type === "logout"),
        postActions: actions.filter((action) => action.type === "posting"),
        getForumActions: actions.filter((action) => action.type === "get_forum"),
        forums
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
          ],
          state.forums.filter((forum) => !forum.is_deleted)
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
        ],
        state.forums.filter((forum) => !forum.is_deleted)  
      );

      if (rs.status != 200) {
        alert(rs.message);
        return;
      }
      history.go(0);
      return;
    },

    onEditForum: () => {
      if (state.forums.some((forum, index) => { return index != state.updateForum && ( forum.forum_name === state.forum_name || forum.forum_url === state.forum_url ) } )) {
        alert("Forum name or forum url is exist");
        return;
      }
      state.forums[state.updateForum].forum_url = state.forum_url;
      state.forums[state.updateForum].forum_name = state.forum_name;
      setState({ ...state, forums: [...state.forums], forum_name: null, forum_url: null, updateForum: null })
    },

    onAddForum: () => {
      if (state.forums.some(forum => forum.forum_name === state.forum_name || forum.forum_url === state.forum_url)) {
        alert("Forum name or forum url is exist");
        return;
      }
      state.forums.unshift({
        forum_name: state.forum_name,
        forum_url: state.forum_url,
        is_deleted: false
      })
      setState({ ...state, forums: [...state.forums], forum_name: null, forum_url: null })
    },

  }

  const value = {
    columns: [
      { title: "Forum name", width: "30%",render: (data) => <Text strong>{data.forum_name} { data.is_deleted ? <Text type="danger">(deleted)</Text> : null }</Text> },
      { title: "Forum URL", width: "50%",render: (data) => <Link href={data.forum_url}><Text strong type="secondary">{data.forum_url}</Text></Link> },
      { title: "Action", width: "20%",render: (data, _, index) => {
        if (data.is_deleted) {
          return <Space>
            <Button type="primary" style={{ backgroundColor: "#a0d911", borderColor: "#a0d911" }}
              onClick={() => {
                data.is_deleted = false;
                setState({ ...state, forums: [...state.forums] })
              }}
            >Revert</Button>
          </Space>
        }
        return (
          <Space>
            <Button type="primary" style={{ backgroundColor: "#fadb14", borderColor: "#fadb14" }}
              onClick={() => {
                setState({ ...state, updateForum: index, forum_name: data.forum_name, forum_url: data.forum_url })
              }}
            >Edit</Button>
            <Button type="primary" danger
              onClick={() => {
                data.is_deleted = true;
                setState({ ...state, forums: [...state.forums] })
              }}
            >Remove</Button>
          </Space>
        )
      } }
    ]
  }


  return {
    state,
    action,
    value,
    setState
  }
}

export default useWebCreateHook;