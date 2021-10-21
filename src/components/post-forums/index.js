import { Card, Space, Select, Typography, Button, Table, Divider, Spin } from "antd";
import React from "react";
import WebTooltip from "../web-tooltip";
import usePostForumsHook from "./hook";

const { Text } = Typography;

function PostForums() {
  const { context, state, action, value } = usePostForumsHook();
  return (
    <Card title={<Text>Forums { state.isLoading ? <Spin/> : null }</Text>}>
      <Space direction="horizontal" size="large">
        <WebSeletor 
          webs={context.webs}
          selected={state.web_id}
          onSelectChange={action.onSelectChange}
        />
        <ForumsSeletor 
          forums={context.forums.filter((forum) => forum.web_id === state.web_id)}
          selected={state.forum_id}
          onSelectChange={action.onSelectChange}
        />
        <Button onClick={action.onSelectClick} type="primary">Selete</Button>
      </Space>
      <Divider/>
      <Table 
        columns={value.forumsColumns}
        dataSource={context.selectedForums}
      />
      <Divider/>
      <Button style={{ float: "left" }} onClick={() => action.onNext("search")}>Search page</Button>
      <Button style={{ float: "right" }} type="primary" onClick={() => action.onNext("content")}>Write content</Button>
    </Card>
  )
}

function WebSeletor(props) {
  const { webs, selected, onSelectChange } = props;
  return (
    <Space direction="horizontal" size="large">
      <Text style={{ width: "100px" }}  strong>Web :</Text>
      <Select value={selected} onChange={(value) => onSelectChange("web", value)} style={{ width: "250px" }}>
          {
            webs.map((web) => {
              return <Select.Option value={web.id}><WebTooltip web={web} >{web.web_name}</WebTooltip></Select.Option>
            })
          }
      </Select>
    </Space>
  )
}

function ForumsSeletor(props) {
  const { forums, selected, onSelectChange } = props;
  return (
    <Space direction="horizontal" size="large">
      <Text style={{ width: "100px" }} strong>Forums :</Text>
      <Select value={selected} style={{ width: "250px" }} onChange={(value) => onSelectChange("forum", value)}>
        {
          forums.map((forum) => {
            return <Select.Option value={forum.id}>
              <WebTooltip web={{ web_key: "dien_dan", web_name: forum.forum_name, web_url: forum.forum_url }}>{forum.forum_name}</WebTooltip>
            </Select.Option>
          })
        }
      </Select>
    </Space>
  )
}

export default PostForums;