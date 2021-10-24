import { Card, Progress, Space, Spin, Typography, Tag, Table, Divider } from "antd";
import React from "react";
import useProgressingHook from "./hook";

const { Text } = Typography;

function Progressing() {
  const { state, value } = useProgressingHook();

  const progressingBar = () => {
    switch(state.progressing.status) {
      case "success": {
        return <Progress percent={100} />
      }
      case "waiting": {
        return null;
      }
      default: {
        return <Progress 
          percent={((+state.progressing.progressing_amount / +state.progressing.progressing_total) * 100)} 
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
    }
  }

  return (
    <Card title={<Text>Progressing for posting { state.isLoading ? <Spin/> : null }</Text>}>
      <Space direction="horizontal" size="middle" >
        <Text>Status :</Text>
        { tag() }
      </Space>
      <p/>
      { progressingBar() }
      <Divider/>
      <Table 
        dataSource={state.postingStatus}
        columns={value.columns}
      />
    </Card>
  )
}

export default Progressing;