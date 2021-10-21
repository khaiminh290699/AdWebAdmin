import React, { useContext, useState, useEffect } from "react";
import { Space, Typography } from "antd";
import usePostContext from "../post/context";
import Api from "../../api";
import Socket from "../../socket";
import { EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';


const { Text, Link } = Typography;

function usePostForumsHook() {
  const api = new Api();
  const context = useContext(usePostContext);
  let [state, setState] = useState({ isLoading: true, web_id: context.state.webs[0].id, forum_id: null });

  useEffect(async () => {
    const { state: { selectedPosts, refetchSelectForums, selectedForums } } = context;
    if (refetchSelectForums && selectedPosts.length) {
      const { responseKey } = await api.getCommunity(selectedPosts);
      const socket = await new Socket().connect("users");
      socket.on(`get-community-${responseKey}`, async (data) => {
        await socket.close();
        setState({ ...state, isLoading: false });
        context.dispatch({ data: { selectedForums: [ ...selectedForums, ...data.selectedForums ], refetchSelectForums: false } })
      })
    } else {
      setState({ ...state, isLoading: false });
    }
  }, [])


  const action = {
    onSelectChange: (type, value) => {
      if (type === "web") {
        setState({ ...state, web_id: value, forum_id: null });
        return;
      }
      setState({ ...state, forum_id: value });
    },

    onSelectClick: () => {
      const { forum_id } = state;
      if (!forum_id) {
        return;
      }
      const { state: { forums, selectedForums } } = context;
      if (selectedForums.filter((selectedForum) => selectedForum.id === forum_id)[0]) {
        return;
      }
      const forum = forums.filter((forum) => forum.id === forum_id)[0];
      selectedForums.unshift(forum);
      context.dispatch({ data: { selectedForums: [ ...selectedForums ] } })
    },

    onRemoveForumPosts: (id) => {
      let { state: { selectedForums, selectedPosts } } = context;
      const forum = selectedForums.filter((selectedForum) => selectedForum.id === id)[0];
      if (forum.source && forum.source.length) {
        const removeSelectedPosts = forum.source.map((post) => post.post_url);
        selectedPosts = selectedPosts.filter((selectedPost) => !removeSelectedPosts.includes(selectedPost));
      }
      context.dispatch({ data: { selectedForums: [ ...selectedForums.filter((selectedForum) => selectedForum.id !== id) ], selectedPosts: [...selectedPosts] } })
    },

    onNext: (pageProgressing) => {
      context.dispatch({ type: "pageProgressing", data: { pageProgressing } });
    }

  }

  const value = {
    forumsColumns: [
      { title: "Forum", witdh: "30%", render: (data) => <Text strong>{ data.forum_name }</Text> },
      { title: "Web", witdh: "30%", render: (data) => <Link href={data.web_url} italic>{ data.web_name }</Link> },
      { title: "Link", witdh: "30%", render: (data) => <Link href={data.forum_url} italic>{ data.forum_url }</Link> },
      { title: "Source", witdh: "30%", render: (data) => {
        return (
          <>
          {
            data.source ? <Text>You selected from posts:</Text> : null
          }
          <ul>
            {
              (data.source || []).map(({ post_url }) => <li key={post_url}><Link type="secondary" italic href={post_url}>{post_url}</Link></li>)
            }
          </ul>
          </>
        )
      } },
      { title: "Action", witdh: "40%", render: (data) => {
        return (
          <Space size="middle">
            <DeleteOutlined style={{ fontSize: "18px", color: "#ff4d4f" }} onClick={() => action.onRemoveForumPosts(data.id)} />
          </Space>
        )
      } }
    ]
  }

  return {
    context: context.state,
    state,
    action,
    value
  }
}

export default usePostForumsHook;