import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Api from "../../api";
import Socket from "../../socket";
import WebTooltip from "../web-tooltip";
import { Typography } from "antd";
import PasswordHidden from "../account/password";

import { PauseCircleTwoTone, CheckCircleTwoTone, CloseCircleTwoTone  } from '@ant-design/icons';


const { Text } = Typography;

function useProgressingHook() {
  const api = new Api();
  const { id } = useParams();
 
  let [state, setState] = useState({ isLoading: true, progressing: {}, postingStatus: [] });

  useEffect(async () => {
    const { progressing, postingStatus } = await api.getProgressing(id);
    state.isLoading = false;
    state.progressing = progressing;
    state.postingStatus = postingStatus;
    setState({ ...state });

    console.log(`progressing_${progressing.id}`)

    const socket = await new Socket().connect("users");
    socket.on(`progressing_${progressing.id}`, (data) => {
      console.log(data)
      const { postingStatus } = data;
      if (postingStatus) {
        const index = state.postingStatus.findIndex((posting) => posting.id === postingStatus.id);
        state.postingStatus[index] = {
          ...state.postingStatus[index],
          ...postingStatus
        }
        console.log(index, state.postingStatus[index]);
        state.postingStatus = [...state.postingStatus];
      }
      state.progressing = data;
      setState({ ...state });
    })
  }, [])

  const value = {
    columns: [
      { title: "Website", render: (data) => <WebTooltip web={data} ><Typography.Link href={data.web_url} type="secondary" strong>{data.web_name}</Typography.Link></WebTooltip> },
      { title: "Forums", render: (data) => <Typography.Link href={data.forum_url} strong>{data.forum_name}</Typography.Link> },
      { title: "Account", render: (data) => <Text strong>{data.username}</Text> },
      { title: "Password", render: (data) => <PasswordHidden password={data.password} /> },
      { title: "Status", render: (data) => {
        if (data.status === "success") {
          return <div style={{ textAlign: 'center' }}><CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '26px' }} /></div>

        }

        if (data.status === "fail") {
          return <div style={{ textAlign: 'center' }}><CloseCircleTwoTone twoToneColor="#ff7a45" style={{ fontSize: '26px' }} /></div>
        }

        return <div style={{ textAlign: 'center' }}><PauseCircleTwoTone twoToneColor="#d4b106" style={{ fontSize: '26px' }} /></div>
      } }
    ]
  }

  return {
    state,
    value
  }
}

export default useProgressingHook;