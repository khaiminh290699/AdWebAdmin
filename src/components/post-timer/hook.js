import { Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Api from "../../api";
import Socket from "../../socket";
import PasswordHidden from "../account-manage/password";
import WebTooltip from "../web-tooltip";

import { PauseCircleTwoTone, CheckCircleTwoTone, CloseCircleTwoTone  } from '@ant-design/icons';

const { Text } = Typography;

function usePostTimerHook() {
  const api = new Api();
  let [state, setState] = useState({ timerPosts: [], isLoading: true, inDate: moment(new Date()).startOf("date").toDate() })
  useEffect(async () => {
    const rs = await api.getListTimerPost(state.inDate);
    if (rs.status != 200) {
      return;
    }
    const { data: { timerPosts } } = rs;
    state.timerPosts = timerPosts;
    state.isLoading = false;
    setState({ ...state });

    const socket = await new Socket().connect("users");
    socket.on("timer_posting", (data) => {
      const { postingStatus } = data;
      const index = state.timerPosts.findIndex((timerPost) => timerPost.setting_id === postingStatus.setting_id && timerPost.forum_id === postingStatus.forum_id);
      state.timerPosts[index] = {
        ...state.timerPosts[index],
        status: postingStatus.status,
        actutal_posting_timer: postingStatus.updated_at,
        message: postingStatus.message
      }
      state.timerPosts = [...state.timerPosts];
      setState({ ...state });
    })
  }, [])

  const value = {
    columns: [
      { title: "Website", render: (data) => <WebTooltip web={data} ><Typography.Link href={data.web_url} type="secondary" strong>{data.web_name}</Typography.Link></WebTooltip> },
      { title: "Forums", render: (data) => <Typography.Link href={data.forum_url} strong>{data.forum_name}</Typography.Link> },
      { title: "Account", render: (data) => <Text strong>{data.username}</Text> },
      { title: "Password", render: (data) => <PasswordHidden password={data.password} /> },
      { title: "Timer setting", render: (data) =>  <Text>{data.timer_setting}</Text>},
      { title: "Actual posting", render: (data) =>  <Text>{data.actutal_posting_timer ? moment(data.actutal_posting_timer).format("HH:mm") : "waiting"}</Text>},
      { title: "Status", render: (data) => {
        if (data.status === "success") {
          return <div style={{ textAlign: 'center' }}><CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '26px' }} /></div>

        }

        if (data.status === "fail") {
          return <div style={{ textAlign: 'center' }}><CloseCircleTwoTone twoToneColor="#ff7a45" style={{ fontSize: '26px' }} /></div>
        }

        return <div style={{ textAlign: 'center' }}><PauseCircleTwoTone twoToneColor="#d4b106" style={{ fontSize: '26px' }} /></div>
      } },
    ]
  }

  const action = {
    onDatePickerChange: async (value) => {
      state.inDate = moment(value).startOf("date").toDate();
      state.isLoading = true;
      setState({ ...state });

      const rs = await api.getListTimerPost(state.inDate);
      if (rs.status != 200) {
        return;
      }
      const { data: { timerPosts } } = rs;
      state.timerPosts = timerPosts;
      state.isLoading = false;
      setState({ ...state });
    }
  }
  
  return {
    state,
    value,
    action
  }
}

export default usePostTimerHook;