import React, { useContext, useEffect, useState } from "react";
import { Typography } from "antd";
import { Link } from "react-router-dom"
import useAppHook from "../../App.context"
import Api from "../../api";

import { RedoOutlined, DeleteOutlined } from '@ant-design/icons';


const { Text } = Typography;

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
      } else {
        state.mode = null;
      }
      const rs = await api.listPosts([], {}, state.page, value.limit, state.mode)
      if (rs.status != 200) {
        return;
      }
      const { data: { posts, total } } = rs;
      setState({ ...state, posts, total , isLoading: false });
    },

    onPaginationChange: async (page) => {
      setState({...state, isLoading: true})
      state.page = page;
      const rs = await api.listPosts([], {}, state.page, value.limit, state.mode)
      if (rs.status != 200) {
        return;
      }
      const { data: { posts, total } } = rs;
      setState({ ...state, posts, total , isLoading: false });
    },

    onTogglePost: async (post_id, index) => {
      setState({...state, isLoading: true})
      const rs = await api.togglePost(post_id)
      if (rs.status != 200) {
        alert(rs.message);
        return;
      }
      const { data: { post } } = rs;
      state.posts[index].is_deleted = post.is_deleted;
      setState({ ...state, posts: [...state.posts] , isLoading: false });
    }
  }

  const value = {
    limit: 5,
    columns: [
      { title: "Title", width: "20%",render: (data) => <Link to={`/post/${data.id}`}><Text strong>{data.title}</Text></Link> },
      { title: "Content", width: "40%", render: (data) => <Text>{data.content}...<Link to={`/post/${data.id}`}><Text strong style={{ color: "black" }}>Read more</Text></Link></Text> },
      { title: "User", width: "20%", render: (data) => <Text>{data.username}</Text> },
      { title: "Status", width: "10%", render: (data) => {
        if (data.is_deleted) {
          return <Text type="danger">Deleted</Text>
        }
        return null
      }},
      { title: "Action", width: "10%", render: (data, d,index) => {
        if (!data.is_deleted) {
          return <DeleteOutlined onClick={() => action.onTogglePost(data.id, index)} style={{ fontSize: "18px", color: "#ff4d4f" }} />
        }
        return <RedoOutlined onClick={() => action.onTogglePost(data.id, index)} style={{ fontSize: "18px", color: "#1efa85" }} />
      }},
    ]
  }

  return {
    context: context.state,
    state,
    action,
    value
  }
}

export default usePostManageHook;