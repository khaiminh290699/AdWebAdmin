import { Button, Card, Checkbox, Divider, List, Modal, Space, Spin, Table, TimePicker, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import Api from "../../api";
import PasswordHidden from "../account/password";
import WebTooltip from "./web-tooltip";
import moment from "moment";

const { Link, Text } = Typography;

function Account(props) {
  const api = new Api();
  const format = "HH:00";

  const { checkedUrls, webs, accountSetting, onStateChange } = props;
  let [state, setState] = useState({
    webUrls: [],
    isLoading: false,
    accounts: [],
    reload: false,
    setting: null
  });

  useEffect(async () => {
    const webUrls = Object.keys(Object.keys(checkedUrls).reduce((webUrls, url) => {
      const strs = url.split("/");
      webUrls[`${strs[0]}//${strs[2]}`] = true;
      return webUrls;
    }, {}));
    setState({ ...state, isLoading: true });
    const accounts = await api.listAccounts([{ url: { "$in": webUrls } }]);
    setState({ ...state, webUrls, isLoading: false, accounts });

  }, [])
  
  useEffect(async () => {
    if (state.reload) {
      const accounts = await api.listAccounts([{ url: { "$in": state.webUrls } }]);
      setState({ ...state, isLoading: false, reload: false, accounts });
    }
  }, [state.reload])

  const onSetting = (account_id) => {
    setState({ ...state, setting: account_id });
  }

  const onCheck = (checked, data) => {
    if (!checked) {
      const key = Object.keys(data)[0];
      if (accountSetting[state.setting]) {
        if (key === "timer" && data[key] === "not") {
          accountSetting[state.setting][key] = moment(new Date(), format);
        } else {
          delete accountSetting[state.setting][key]
        }
      }
      if (key === "create") {
        delete accountSetting[state.setting]
      }
      console.log(accountSetting)
      onStateChange({ ...accountSetting });
      return;
    }
    if (!accountSetting[state.setting]) {
      accountSetting[state.setting] = {
        timer: "not"
      };
    }
    accountSetting[state.setting] = { ...accountSetting[state.setting], ...data };
    if (!accountSetting[state.setting].timer) {
      accountSetting[state.setting].timer = "not";
    }
    onStateChange({ ...accountSetting });
  }

  const columns = [
    { title: "Account name",dataIndex: "username", key: "username", render: (data) => <Text>{data}</Text> },
    { title: "Password",dataIndex: "password", key: "password", width: "30%", render: (data) => <PasswordHidden password={data}></PasswordHidden> },
    { title: "Action", width: "20%", render: (data) => {
      return <Button onClick={() => onSetting(data.id)} type="primary">Setting</Button>
    } },
    {
      title: "Description", width: "30%", render: (data) => {
        if (!accountSetting[data.id]) {
          return <Text>No action</Text>
        }
        return (
          <ul>
            <li key={`${data.id}_create_type`}>Create type: <Text strong>{accountSetting[data.id].create}</Text></li>
            <li key={`${data.id}_timer_setting`}>Timer setting: <Text strong>{accountSetting[data.id].timer != "not" ? moment(new Date(accountSetting[data.id].timer)).format(format) : "no_setting"}</Text></li>
          </ul>
        )
      }
    }

  ]

  return (
    <Card title={<Text>Account management { state.isLoading ?  <Spin></Spin> : null}</Text>}>
      <Tooltip title="If you not have any account please manage your accounts">
        <Button onClick={() => setState({ ...state, reload: true })}>Reload { state.reload ? <Spin/> : null }</Button>
      </Tooltip>
      <p></p>
      {
        state.setting ?
        <Modal
          visible={true}
          onCancel={() => setState({ ...state, setting: null })}
          footer = {
            <Space size="middle">
              <Button type="default" onClick={() => {
                delete accountSetting[state.setting];
                onStateChange({ ...accountSetting });
              }}>Cancel setting</Button>
              <Button type="primary" onClick={() => setState({ ...state, setting: null })}>Ok</Button>
            </Space>
          }
        >
          <Text strong>Setting </Text>
          <table>
            <tr>
              <td><Text strong>Create method</Text></td>
              <td style={{width: "40%"}}>: <Checkbox checked={accountSetting[state.setting] && accountSetting[state.setting].create === "create_only" } onChange={(event) => onCheck(event.target.checked, { create: "create_only" })}>Create only</Checkbox></td>
              <td style={{width: "40%"}}><Checkbox checked={accountSetting[state.setting] && accountSetting[state.setting].create === "creat_and_post" } onChange={(event) => onCheck(event.target.checked, { create: "creat_and_post" })}>Create and posting</Checkbox></td>
            </tr>
            <p></p>
            {
              accountSetting[state.setting] ?
              <tr>
                <td><Text strong>Set timer</Text></td>
                <td>: <Checkbox checked={ accountSetting[state.setting].timer === "not" } onChange={(event) => onCheck(event.target.checked, { timer: "not" })}>Not setting timer</Checkbox></td>
                <td><TimePicker disabled={ accountSetting[state.setting].timer === "not" } value={accountSetting[state.setting].timer  && accountSetting[state.setting].timer != "not" ? accountSetting[state.setting].timer : moment(new Date(), format)} format={format}
                  onChange={(value) => {
                    onCheck(true, { timer: moment(value, format) });
                  }}
                ></TimePicker></td>
              </tr>
              :
              null
            }
          </table>
        </Modal>
        :
        null
      }
      <List
        bordered={false}
        dataSource={state.webUrls}
        renderItem={(item) => {
          const web = webs.filter((web) => web.url.includes(item))[0] || {};
          const accounts = state.accounts.filter((account) => account.url.includes(item) || item.includes(account.url));
          return (
            <>
              <Card title={<WebTooltip web={web} />}>
                <Table 
                  pagination={false}
                  columns={columns}
                  dataSource={accounts}
                />
              </Card>
              <p></p>
            </>
          )
        }}
      />
    </Card>
  )
}

export default Account;