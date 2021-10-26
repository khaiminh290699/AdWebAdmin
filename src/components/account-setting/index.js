import { Button, Card, Divider, Typography, Table, Modal, Space, Checkbox, TimePicker, Spin } from "antd";
import React from "react";
import useAccountSettingHook from "./hook";
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import moment from "moment";
import { Redirect } from "react-router";

const { Text, Link } = Typography;

function AccountSetting() {
  const format = "HH:mm";
  const { context, state, action, value } = useAccountSettingHook();
  const modal = () => {
    if (state.setting) {
      const setting = context.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      return (
        <Modal visible={true}
          title={<Text>Setting for account: <Text strong>{state.setting.username}</Text></Text>}
          onCancel={action.onCancel}
          footer={<></>}
        >
          <Text strong>Create setting :</Text>
          <br /><br />
          <Space size="large">
            <p></p><p></p><p></p>
            <Checkbox 
              checked={setting.create_type === "create_only"} 
              onChange={(event) => action.onCheck(event.target.checked, "create_type", "create_only")}
            > create only </Checkbox>
            <Checkbox 
              checked={setting.create_type === "create_and_post"} 
              onChange={(event) => action.onCheck(event.target.checked, "create_type", "create_and_post")}
            > create {'&'} post </Checkbox>
          </Space>
          <br /><br />
          <Text strong>Timer setting :</Text>
          <br /><br />
          <Space size="large">
            <p></p><p></p><p></p>
            <Checkbox 
              checked={setting.timer_setting === "not"} 
              onChange={(event) => action.onCheck(event.target.checked, "timer_setting", "not")}
            > not setting</Checkbox>
            <TimePicker 
              disabled={setting.timer_setting === "not"} 
              format={format} 
              value={setting.timer_setting != "not" ? moment(setting.timer_setting) : null}
              onChange={(value) => {
                alert(value);
                action.onCheck(true, "timer_setting", value)
              }}
            />
          </Space>
        </Modal>
      )
    }
  }

  // const redirect = () => {
  //   if (state.progressing) {
  //     return <Redirect to={`/progressing/${state.progressing.id}`} />
  //   }
  // }
  return (
    <Card title={<Text>Account setting</Text>}>
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
      <Button style={{ float: "left" }} onClick={() => action.onNext("content")}><DoubleLeftOutlined /> Write content </Button>
      <Button style={{ float: "right" }} type="primary" onClick={action.onCreatePost}>Create post<DoubleRightOutlined/> </Button>
    </Card>
  )
}

export default AccountSetting;