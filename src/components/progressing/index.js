import { Card, Progress, Space, Spin, Typography, Tag, Table, Divider, Button } from "antd";
import React from "react";
import useProgressingHook from "./hook";

const { Text } = Typography;

function Progressing(props) {
  const { state, value, action } = useProgressingHook(props);
  
  const progressingBar = () => {
    switch(state.progressing.status) {
      case "success": {
        return <Progress percent={100} />
      }
      case "waiting", "removed": {
        return null;
      }
      default: {
        return <Progress 
          percent={Math.round((+state.progressing.progressing_amount / +state.progressing.progressing_total) * 100)} 
          status={state.progressing.status === "fail" ? "exception" : "active"}
        />
      }
    }
  }

  function tag() {
    switch(state.progressing.status) {
      case "success": {
        return <Tag color="green">success</Tag>
      }
      case "fail": {
        return <Tag color="red">fail</Tag>
      }
      case "progressing": {
        return <Tag color="blue">progressing</Tag>
      }
      case "waiting": {
        return <Tag color="orange">waiting</Tag>
      }
      case "removed": {
        return <Tag color="red">removed</Tag>
      }
    }
  }

  return (
    <Card title={<Text>Progressing For Posting { state.isLoading ? <Spin/> : null }</Text>}>
      <Space direction="horizontal" size="middle" >
        <Text strong>ID : {state.progressing.id}</Text>
      </Space>
      <p/>
      <Space direction="horizontal" size="middle" >
        <Text strong>Status :</Text>
        { tag() }
      </Space>
      <p/>
      { progressingBar() }
      <p />
      <Space size="large">
        <Button disabled={state.progressing.status != "progressing"} onClick={action.onCancel}>Cancel</Button>
        <Button disabled={state.progressing.status === "waiting" || state.progressing.status === "progressing"} type="primary" onClick={action.onRePost}>Re-progressing</Button> <Text type="secondary">(reposting only fail post and not posted in this progressing)</Text>
      </Space>
      <Divider/>
      <Table 
        dataSource={state.postingStatus}
        columns={value.columns}
      />
    </Card>
  )
}

export default Progressing;