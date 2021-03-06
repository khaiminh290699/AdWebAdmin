import { Card, Table, Spin, Typography, Tag, Progress, Space, Divider, Button, Input } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import WebTooltip from "../web-tooltip";
import usePostDetailHook from "./hook";

const { Text, Paragraph } = Typography;

function PostDetail() {
  const { state, value } = usePostDetailHook();

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
          percent={Math.round((+state.progressing.done / +state.progressing.total) * 100)} 
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
    <Card title={state.isLoading ? <>Loading <Spin/></> : <>Post: <Text strong type="secondary">{state.post.title} { state.post.is_deleted ? <Tag color="red">Deleted</Tag> : null }</Text></>} >
      {
        state.post && state.post.user_id === JSON.parse(localStorage.getItem("user")).id ?
        (
          <>
            <Space>
              <Button style={{ backgroundColor: "yellow" }}>
                <Link to={`/post/update/${state.post.id}`}>
                <Text strong style={{ color: "black" }}>Update</Text>
                </Link>
              </Button>
            </Space>
            <Divider />
          </>
        ) : null
      }
      {
        state.progressing ? 
        (
          <Card title={<Text>Progressing For Posting</Text>}>
            <Space direction="horizontal" size="middle" >
              <Text strong>ID : <Link to={`/progressing/${state.progressing.id}`}>{state.progressing.id}</Link></Text>
            </Space>
            <p/>
            <Space direction="horizontal" size="middle" >
              <Text strong>Status :</Text>
              { tag() }
            </Space>
            <p/>
            { progressingBar() }
            <p />
          </Card>
        ) : null
      }
      <p/>
      <Card title="Content">
        <Space>
          <Text strong>Title :</Text>
          <Text> {state.post.title} </Text>
        </Space>
        <p />
        <Space>
          <Text strong>Total Click :</Text>
          <Text>{ state.total_click }</Text>
        </Space>
        <p/>
        <Paragraph>
          <pre>
            <div dangerouslySetInnerHTML={{ __html: state.post.content }}></div>
          </pre>
        </Paragraph>
        {/* <div>
          <Text strong>Forums : </Text> 
          {
            state.forums.map((forum) => {
              return <Tag color="cyan"><WebTooltip web={forum}>{forum.forum_name}</WebTooltip></Tag>
            })
          }
        </div> */}
      </Card>
      <br/>
      <Card title="Account Setting">
        <Table 
          dataSource={state.accountSettings}
          columns={value.accountColumns}
          pagination={false}
        />
      </Card>

    </Card>
  )
}

export default PostDetail;