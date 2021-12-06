import { Typography } from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import Api from "../../api";
import Socket from "../../socket";
import PasswordHidden from "../account-manage/password";
import WebTooltip from "../web-tooltip";

import { PauseCircleTwoTone, CheckCircleTwoTone, CloseCircleTwoTone  } from '@ant-design/icons';
import useAppContext from "../../App.context";
import { Link } from "react-router-dom";

let socket = null;
const { Text } = Typography;

function usePostTimerHook() {
  const api = new Api();

  const context = useContext(useAppContext);

  let [state, setState] = useState({ 
    timerPosts: [], 
    isLoading: true, 
    inDate: moment(new Date()).startOf("date"), 
    total: 0, 
    mode: null 
  })

  useEffect(async () => {
    const rs = await api.getListTimerPost(state.inDate, [], { timer_at: -1 });
    if (rs.status != 200) {
      return;
    }
    const { data: { timerPosts, total } } = rs;
    state.timerPosts = timerPosts;
    state.isLoading = false;
    state.total = total;
    setState({ ...state });

    socket = await new Socket().connect("users");
    socket.on(`timer_posting_${moment(new Date()).startOf("date").format("DD_MM_YYYY")}`, (data) => {
      const postingStatus = data;
      const index = state.timerPosts.findIndex((timerPost) => timerPost.timer_setting_id === postingStatus.timer_setting_id);
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

  useEffect(() => () => {
    if (socket) {
      socket.disconnect();
    }
  }, [])

  const value = {
    limit: 5,
    columns: [
      { title: "Website", render: (data) => <WebTooltip web={data} ><Typography.Link href={data.web_url} type="secondary" strong>{data.web_name}</Typography.Link></WebTooltip> },
      { title: "Forums", render: (data) => <><Typography.Link href={data.forum_url} strong>{data.forum_name}</Typography.Link> { data.forum_deleted ? <Text strong type="danger">(deleted)</Text> : null } </> },
      { title: "User", render: (data) => <Text strong>{data.user_username}</Text> },
      { title: "Account", render: (data) => <Text strong>{data.username}</Text> },
      { title: "Post", render: (data) => <Text strong><Link to={`/post/${ data.post_id }`} >{data.title}</Link></Text> },
      { title: "Timer setting", render: (data) =>  <Text>{data.timer_at}</Text>},
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
      { title: "Message", render: (data) => {
        if (data.status === "success") {
          return <Text type="success">{data.message}</Text>
        }

        if (data.status === "fail") {
          return <Text type="danger">{data.message}</Text>
        }
        return <Text type="warning">waiting</Text>
      } },
    ]
  }

  const action = {
    onDatePickerChange: async (value) => {
      state.inDate = moment(value).startOf("date")
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
    },

    onPaginationChange: async () => {

    }
  }
  
  return {
    context: context.state,
    state,
    value,
    action
  }
}

export default usePostTimerHook;