import React, { useEffect, useState } from "react";
import { Space, Tag, Typography } from "antd"
import { useParams } from "react-router";
import Api from "../../api";
import WebTooltip from "../web-tooltip";
import PasswordHidden from "../account-manage/password";
import moment from "moment";
import Socket from "../../socket";

const { Text } = Typography;

function usePostDetailHook() {
  let socket = null;
  const api = new Api();

  const params = useParams();
  const { id } = params;

  let [state, setState] = useState({ 
    isLoading: true, 
    post: {}, 
    accountSettings: [], 
    forums: [] ,
    progressing: {}
  });

  useEffect(async () => {
    const rs = await api.getOnePost(id);
    if (rs.status != 200) {
      return;
    }
    const { data: { post, accountSettings, forums, progressing } } = rs;
    state = { ...state, isLoading: false, post, accountSettings, forums, progressing }
    setState(state)

    socket = await new Socket().connect("users");
    socket.on(`progressing_${progressing.id}`, (data) => {
      state.progressing = data;
      setState({ ...state });
    })

  }, []);

  useEffect(() => () => {
    if (socket) {
      socket.disconnect();
    }
  }, [])

  const value = {
    accountColumns: [
      { title: "Account", width: "15%", render: (data) => <Text strong>{data.username}</Text> },
      { title: "Password", width: "15%", render: (data) => <PasswordHidden password={data.password} /> },
      { title: "Timer", width: "30%", render: (data) => {
        if (!data.timerSettings.length) {
          return <Text type="warning" strong>- Not Setting Yet</Text>
        }
        return (
          <>
            {
              data.timerSettings.map((timer) => {
                return (
                  <div>
                    - <Text strong>{timer.timer_at}</Text>, from <Text strong>{moment(timer.from_date).format("DD/MM/YYYY")}</Text> to <Text strong>{moment(timer.to_date).format("DD/MM/YYYY")}</Text>
                  </div>
                )
              })
            }
          </>
        )
      } },
      { title: "Forum", width: "30%", render: (data) => {
        console.log(data)
        return (
          <>
            {
              data.forumSettings.map((forum) => {
                return (
                  <Tag>
                    <WebTooltip web={forum}>
                      <Text>{forum.forum_name}</Text>
                    </WebTooltip>
                  </Tag>
                )
              })
            }
          </>
        )
      } }
    ]
  }

  return {
    state,
    value
  }
}

export default usePostDetailHook;