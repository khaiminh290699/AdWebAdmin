import { Button, Card, Divider, Input, Space, Typography } from "antd";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useContentEditorHook from "./hook";
import { DoubleLeftOutlined, DoubleRightOutlined, LinkOutlined  } from '@ant-design/icons';

const { Text } = Typography;

function ContentEditor() {
  const { context, state, action } = useContentEditorHook(); 
  return (
    <Card title="Write Content">
      <Text strong>Title :</Text>
      <Input value={context.title} onChange={(event) => action.onTitleChange(event.target.value)} />
      {
        state.error.title ? <Text type="danger" strong>{state.error.title}</Text> : null
      }
      <Divider/>
      <Text strong>Content :</Text>
      <Editor
        editorState={state.editorState}
        onEditorStateChange={action.onEditorStateChange}
        toolbar={
          {
            image: { uploadCallback: action.onUploadCallback, alt: { present: true, mandatory: true } },
          }
        }
      ></Editor>
      {
        state.error.content ? <Text type="danger" strong>{state.error.content}</Text> : null
      }
      <Divider/>
      <Space>
        <Text strong> Link : </Text>
        <Input value={state.link} onChange={(event) => action.onLinkInputChange(event.target.value)}></Input>
        <Button type="primary" onClick={action.onAddLink}><LinkOutlined /> Add link</Button>
      </Space>
      <Divider/>
      {
        context.selectedPosts.length ?
        (
          <Button style={{ float: "left" }} onClick={() => action.onNext("forums")}> <DoubleLeftOutlined/> Forums </Button>
        )
        :
        (
          <Button style={{ float: "left" }} onClick={() => action.onNext("search")}> <DoubleLeftOutlined/> Search page </Button>
        )
      }
      <Button style={{ float: "right" }} type="primary" onClick={() => action.onNext("account")}> Account setting <DoubleRightOutlined/></Button>
    </Card>
  )
}

export default ContentEditor;