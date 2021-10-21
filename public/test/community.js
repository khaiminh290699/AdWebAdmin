import { Card, Checkbox, Divider, List, Space, Tooltip, Typography, Spin, Table } from "antd";
import Search from "antd/lib/input/Search";
import React, { useEffect, useState } from "react";
import Socket from "../../socket";
import Api from "../../api";
import { DeleteOutlined } from '@ant-design/icons';
import WebTooltip from "./web-tooltip";


const { Text, Link } = Typography;

function Community(props) {
  const api = new Api();
  const { webs, checkedUrls, communities, onStateChange, reloadCommunity } = props;
  let [state, setState] = useState({ isLoading: false })
  useEffect(async () => {
    if (!reloadCommunity) {
      return;
    }
    setState({ ...state, isLoading: true });
    onStateChange({ isLocking: true })
    const { responseKey } = await api.getCommunity(Object.keys(checkedUrls));
    const socket = await new Socket().connect("users");
    socket.on(`get-community-${responseKey}`, async (data) => {
      const { communities } = data;
      await socket.close();
      setState({ ...state, isLoading: false });
      onStateChange({ communities, isLocking: false, reloadCommunity: false })
    })
  }, []);

  const columns = [
    { title: "Web name", render: (data) => {
      return <WebTooltip web={data} ></WebTooltip>
    } },
    { title: "URL", dataIndex: "post_url", key: "post_url", render: (data) => <Link strong type="secondary" href={data}>{data}</Link> },
    { title: "Forum", dataIndex: "community", key: "community", render: (community, data) => <Link strong href={data.href}>{community}</Link> },
    { title: "Action", render: (data, index) => {
      return (
        <DeleteOutlined style={{ fontSize: "18px", color: "#ff4d4f" }}
          onClick={() => {
            communities.splice(index, 1);
            delete checkedUrls[data.post_url];
            onStateChange({ communities: [...communities], checkedUrls })
          }}
        />
      )
    } }
  ]

  return (
    <Card title={state.isLoading ? <Text>Verifying forum from chosen post please waiting for a minute <Spin></Spin></Text> : <Text>Forum for post</Text>}>
      <Table 
        rowKey="post_url"
        pagination={false}
        dataSource={communities}
        columns={columns}
      />
    </Card>
  )
}

export default Community;