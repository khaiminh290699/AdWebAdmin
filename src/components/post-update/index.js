import { Card, Typography, Table, Select, Button, Input, Divider, Space, Modal, Checkbox, Tag, TimePicker, DatePicker } from "antd";
import React from "react";
import usePostUpdateHook from "./hook";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { LinkOutlined  } from '@ant-design/icons';
import moment from "moment";
import WebTooltip from "../web-tooltip";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { RangePicker } = DatePicker

function PostUpdate() {
  const format = "HH:mm";
  const { state, action, value } = usePostUpdateHook();

  const modal = () => {
    if (state.setting) {
      const { setting } = state;
      return (
        <Modal
          width={600}
          visible={true}
          title={<Text>Setting for account: <Text strong>{state.setting.username}</Text></Text>}
          onCancel={action.onCancel}
          footer={<></>}
        >
          <Space>
            <Text strong style={{ display: "inline-block", width: "150px" }}>Create only </Text><Text strong>:</Text>
            <Checkbox disabled={true} checked={setting.is_create_only}></Checkbox>
          </Space>
          <p />
          {
            state.setting.setting_id ?
            (
              <Space>
                <Text strong style={{ display: "inline-block", width: "150px" }}>Select forums </Text><Text strong>:</Text>
                {
                  setting.forumSettings.map((forum, index) => {
                    return <Tag color="magenta" style={{ marginBottom: "5px" }} closable={state.setting.setting_id ? false : true} onClose={(event) => action.onRemoveForum(event, index)}><WebTooltip web={forum} >{ forum.forum_name }</WebTooltip></Tag>
                  })
                }
              </Space>
            )
            :
            (
              <>
                <Space>
                  <Text strong style={{ display: "inline-block", width: "150px" }}>Select forums </Text><Text strong>:</Text>
                  <Select value={state.selectingForum} onChange={action.onSelectForumChange} style={{ width: "300px" }} >
                    {
                      state.forums.filter((forum) => forum.web_key === setting.web_key).map(forum => {
                        return (
                          <Select.Option value={forum.forum_id}>{forum.forum_name}</Select.Option>
                        )
                      })
                    }
                  </Select>
                  <Button type="primary" disabled={!state.selectingForum} onClick={action.onAddForum} >Select</Button>
                </Space>
                <p/>
                {
                  setting.forumSettings.map((forum, index) => {
                    return <Tag color="magenta" style={{ marginBottom: "5px" }} closable={state.setting.setting_id ? false : true} onClose={(event) => action.onRemoveForum(event, index)}><WebTooltip web={forum} >{ forum.forum_name }</WebTooltip></Tag>
                  })
                }
              </>
            )
          }
          <p />
          <Space>
            <Text strong style={{ display: "inline-block", width: "150px" }}>Timer setting </Text><Text strong>:</Text>
          </Space>
          <p/>
          {
            setting.timerSettings.map((timer, index) => {
              return (
                <>
                  <div>
                    <Space>
                      <Text strong>Timer :</Text>
                      <TimePicker 
                        format={format} 
                        value={moment(timer.timer_at, format)}
                        onChange={(value) => action.onTimeChange(value, index)}
                      />
                      <Text strong>Date :</Text>
                      <RangePicker 
                        value={{"0": moment(timer.from_date), "1": moment(timer.to_date)}}
                        // style={{ width: "210px" }}
                        onChange={(value) => action.onTimeRangeChange(value, index)}
                      />
                      <DeleteOutlined onClick={() => action.onRemoveTimer(index)} />
                    </Space>
                  </div>
                  <p/>
                </>
              )
            })
          }
          <Button type="dashed" onClick={action.onAddTimer} block icon={<PlusOutlined />}>Add timer</Button>
        </Modal>
      )
    }
  }

  return (
    <Card title={<Text>Post update</Text>}>
      { modal() }
      <Text strong>Title : </Text>
      <Input value={state.title} onChange={(event) => action.onTitleChange(event.target.value)} />
      <Divider/>
      <Text strong >Content : </Text>
      <Editor
        editorState={state.editorState}
        onEditorStateChange={action.onEditorStateChange}
        toolbar={
          {
            image: { uploadCallback: action.onUploadCallback, alt: { present: true, mandatory: true } },
          }
        }
      ></Editor>
      <Divider/>
      <Space>
        <Text strong  style={{ display: "inline-block", width: "65px" }}> Link </Text><Text strong>:</Text>
        <Input style={{ width: "800px"}} value={state.link} onChange={(event) => action.onLinkInputChange(event.target.value)}></Input>
        <Button type="primary" onClick={action.onAddLink}><LinkOutlined /> Add link</Button>
      </Space>
      <Divider/>

      <Space>
        <Text strong style={{ display: "inline-block", width: "65px" }}> Accounts </Text><Text strong>:</Text>
        <Select value={state.account} style={{ width: "250px" }} onChange={action.onAccountSelectChange}>
          {
            state.accounts.filter((account) => !state.accountSettings.some((setting) => setting.account_id === account.id)).map((account) => {
              return (
                <Select.Option value={account.id}>
                  {account.username} <Text type="secondary">({account.web_name})</Text>
                </Select.Option>
              )
            })
          }
        </Select>
        <Button type="primary" onClick={action.onSelectAccount}>Select</Button>
      </Space>

      <p/>

      <Table 
        dataSource={state.accountSettings}
        columns={value.accountColumns}
        pagination={false}
      />

      <Divider />
      <Button type="primary" onClick={action.onUpdate}>Update</Button>
    </Card>
  )
}

export default PostUpdate;