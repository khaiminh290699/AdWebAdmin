import { Button, Card, Divider, Typography, Table, Modal, Space, Select, TimePicker, Spin, DatePicker, Tag } from "antd";
import React from "react";
import useAccountSettingHook from "./hook";
import { DoubleLeftOutlined, DoubleRightOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from "moment";
import WebTooltip from "../web-tooltip";

const { RangePicker } = DatePicker;
const { Text, Link } = Typography;

function AccountSetting() {
  const format = "HH:mm";
  const { context, state, action, value } = useAccountSettingHook();
  const modal = () => {
    if (state.setting) {
      const setting = context.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      return (
        <Modal
          width={600}
          visible={true}
          title={<Text>Setting for account: <Text strong>{state.setting.username}</Text></Text>}
          onCancel={action.onCancel}
          footer={<></>}
        >
          <Space>
            <Text strong>Select forums :</Text>
            <Select value={state.selectingForum} onChange={action.onSelectForumChange} style={{ width: "350px" }} >
              {
                state.forums.filter((forum) => forum.web_key === setting.web.key).map(forum => {
                  return (
                    <Select.Option value={forum.id}>{forum.forum_name}</Select.Option>
                  )
                })
              }
            </Select>
            <Button type="primary" disabled={!state.selectingForum} onClick={action.onAddForum} >Select</Button>
          </Space>
          <p/>
          {
            setting.forums.map((forum, index) => {
              return <Tag color="magenta" style={{ marginBottom: "5px" }} closable onClose={(event) => action.onRemoveForum(event, index)}><WebTooltip web={forum} >{ forum.forum_name }</WebTooltip></Tag>
            })
          }
          <p />
          <div>
            <Text strong>Timer setting :</Text>
          </div>
          <p/>
          {
            setting.timers.map((timer, index) => {
              return (
                <>
                  <div>
                    <Space>
                      <Text strong>Timer :</Text>
                      <TimePicker 
                        format={format} 
                        value={moment(timer.timer_at)}
                        onChange={(value) => action.onTimeChange(value, index)}
                      />
                      <Text strong>Date :</Text>
                      <RangePicker 
                        value={{"0": timer.from_date, "1": timer.to_date}}
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
    <Card title={<Text>Account Setting</Text>}>
      {/* { redirect() } */}
      { modal() }
      <Text>If you want manage your accounts, please <Link href="/account/manage" target="_blank" type="secondary" italic underline>click here</Link> and then click button reload to sync accounts.</Text>
      <p />
      <Button onClick={action.onReload} type="primary" disabled={state.reload}>{ state.reload ? <Text>Reloading <Spin /></Text> : "Reload" }</Button>
      <Divider />
      <Table 
        pagination={false}
        columns={value.accountColumns}
        dataSource={state.accounts}
      />
      <Divider/>
      { state.error ? <Text strong type="danger">{state.error}</Text> : null }
      <br/>
      <Button disabled={state.isLoading}  style={{ float: "left" }} onClick={() => action.onNext("content")}><DoubleLeftOutlined /> Write content </Button>
      <Button disabled={state.isLoading} style={{ float: "right" }} type="primary" onClick={action.onCreatePost}>Create post<DoubleRightOutlined/> </Button>
    </Card>
  )
}

export default AccountSetting;