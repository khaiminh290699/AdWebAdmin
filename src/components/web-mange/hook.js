import React, { useEffect, useState } from "react";
import Api from "../../api";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined } from '@ant-design/icons';


const { Text } = Typography;

function useWebManageHook() {
  const api = new Api();
  const [state, setState] = useState({
    isLoading: true,
    webs: [],
    page: 1,
    total: 0
  });

  useEffect(async () => {
    const rs = await api.listWebs([], { "web_name": -1 }, state.page, value.limit);
    if (rs.status != 200) {
      alert(rs.message);
      return;
    }
    const { data: { webs, total } } = rs;
    setState({ ...state, isLoading: false, webs, total })
  }, [])

  const value = {
    limit: 5,

    columns: [
      { title: "Web Name", render: (data) => <Text strong>{data.web_name}</Text> },
      { title: "Web Key", render: (data) => <Text type="secondary" italic>{data.web_key}</Text> },
      { title: "URL", render: (data) => <Typography.Link strong href={data.web_url}>{data.web_url}</Typography.Link> },
      { title: "Action", render: (data) => {
        return (
          <Link to={`/web/${data.id}`}>
            <EditOutlined style={{ fontSize: "18px", color: "#faad14" }} />
          </Link>
        )
      } }
    ]
  }

  const action = {
    onPaginationChange: async (page) => {
      state.page = page;
      setState({...state, isLoading: true})
      const rs = await api.listWebs([], { "web_name": -1 }, state.page, value.limit);
      if (rs.status != 200) {
        return;
      }
      const { data: { webs, total } } = rs;
      setState({ ...state, page, webs, total, isLoading: false });
      return;
    },
  }

  return {
    state,
    value,
    action
  }
}

export default useWebManageHook;