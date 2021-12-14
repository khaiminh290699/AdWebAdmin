import React, { useEffect, useState } from "react";
import { Space, Tag, Typography } from "antd"
import { useParams } from "react-router";
import Api from "../../api";
import WebTooltip from "../web-tooltip";
import PasswordHidden from "../account-manage/password";
import moment from "moment";
import Socket from "../../socket";

import { CheckCircleTwoTone  } from '@ant-design/icons';


const { Text, Link } = Typography;

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
    progressing: {},
    total_click: 0
  });

  useEffect(async () => {
    const rs = await api.getOnePost(id);
    if (rs.status != 200) {
      return;
    }
    const { data: { post, accountSettings, forums, progressing, total_click } } = rs;
    state = { ...state, isLoading: false, post, accountSettings, forums, progressing, total_click }
    setState(state)
    if (progressing) {
      socket = await new Socket().connect("users");
      socket.on(`progressing_${progressing.id}`, (data) => {
        state.progressing = data;
        setState({ ...state });
      })
    }

  }, []);

  useEffect(() => () => {
    if (socket) {
      socket.disconnect();
    }
  }, [])

  const value = {
    accountColumns: [
      { title: "Account", width: "10%", render: (data) => <Text strong>{data.username} { data.disable ? <Text strong type="danger">(Disable)</Text> : null }</Text> },
      { title: "Password", width: "15%", render: (data) => <PasswordHidden password={data.password} /> },
      { title: "Timer", width: "50%", render: (data) => {
        if (!data.timerSettings.length) {
          return <Text type="warning" strong>- Not Setting Yet</Text>
        }
        return (
          <>
            {
              data.timerSettings.map((timer) => {
                return (
                  <div>
                    - At <Text strong>{timer.timer_at}</Text>, from <Text strong>{moment(timer.from_date).format("DD/MM/YYYY")}</Text> to <Text strong>{moment(timer.to_date).format("DD/MM/YYYY")}</Text>, with forum Forums: <Link href={timer.forum_url}><Text strong>{timer.forum_name}</Text></Link> <Text type="secondary">({timer.web_name})</Text>.
                  </div>
                )
              })
            }
          </>
        )
      } },
      { title: <Text>Forum <Text type="secondary">(choose for posting when create)</Text></Text>, width: "30%", render: (data) => {
        if (!data.forumSettings.length) {
          return <Text type="secondary" italic>Not thing</Text>
        }
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