import { Button, Checkbox, Space, Typography } from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import Api from "../../api";
import PasswordHidden from "../account/password";
import usePostContext from "../post/context";
import WebTooltip from "../web-tooltip";
import Socket from "../../socket"

const { Text, Link } = Typography;

function useAccountSettingHook() {
  const api = new Api();
  const format = "HH:mm";
  const context = useContext(usePostContext);
  const [state, setState] = useState({ isLoading: true, accounts: [], setting: null, reload: true, progressing: null });

  useEffect(async () => {
    if (state.reload) {
      const { state: { selectedForums, accountSettings } } = context;
      const accounts = await api.listAccounts([{ web_key: { $in: selectedForums.map((selectedForum) => selectedForum.web_key) } }], { web_name: 1 });
      setState({ ...state, isLoading: false, accounts, reload: false })
      context.dispatch({ accountSettings: accountSettings.filter((accountSetting) => !accounts.some((account) => account.id === accountSetting.account_id) ) })
    }
  }, [state.reload])

  const action = {
    onSelectAccount: (checked, account_id) => {
      const { state: { accountSettings } } = context;
      const index = accountSettings.findIndex(accountSetting => accountSetting.account_id === account_id)
      if (checked) {
        if (index === -1) {
          accountSettings.push({
            account_id,
            create_type: "create_only",
            timer_setting: "not"
          })
        }
      } else {
        if (index != -1) {
          accountSettings.splice(index, 1)
        }
      }
      context.dispatch({ accountSettings: [...accountSettings] })

    },

    onSettingClick: (account) => {
      setState({ ...state, setting: account });
    },

    onCancel: () => {
      setState({ ...state, setting: null })
    },

    onCheck: (checked, type, value) => {
      alert(value);
      const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      if (!checked) {
        if (type === "create_type") {
          if (value === "create_only") {
            value = "create_and_post"
          } else {
            value = "create_only"
          }
        }

        if (type === "timer_setting") {
          value = moment().set("millisecond", 0).set("second", 0).set("millisecond", 0).toDate();
        }
      }
      setting[type] = value;
      context.dispatch({ accountSettings: [...context.state.accountSettings] })
    },

    onReload: () => {
      setState({ ...state, reload: true })
    },

    onNext: (pageProgressing) => {
      context.dispatch({ type: "pageProgressing", data: { pageProgressing } });
    },

    onCreatePost: async () => {
      const { content, title, selectedForums, accountSettings } = context.state;
      const post = {
        content, title
      }
      const forums = selectedForums.map((selectedForum) =>selectedForum.id);
      const settings = accountSettings;
      const data = await api.createPost(post, forums, settings);
      if (data.progressing) {
        setState({ ...state, progressing: data.progressing })
      }
    }
  }

  const value = {
    accountColumns: [
      { title: "Selected", width: "1%", render: (data) => <Checkbox checked={context.state.accountSettings.some((accountSetting) => accountSetting.account_id === data.id)} onChange={(event) => action.onSelectAccount(event.target.checked, data.id)} /> },
      { title: "Account", width: "10%", render: (data) => <Text>{data.username}</Text> },
      { title: "Password",  width: "15%", render: (data) => <PasswordHidden password={data.password} /> },
      { title: "Website",  width: "15%", render: (data) => <WebTooltip web={data}><Link href={data.web_url}>{data.web_name}</Link></WebTooltip> },
      { title: "Setting",  width: "25%", render: (data) => {
        const { state: { accountSettings } } = context;
        const selected = accountSettings.filter((accountSetting) => accountSetting.account_id === data.id)[0];
        if (selected) {
          return (
            <Space>
              <Button onClick={() => action.onSettingClick(data)} type="primary">Setting</Button>
            </Space>
          )
        }
        return <Text strrong>No selected</Text>
      } },
      { title: "Desciprtion", render: (data) => {
        const { state: { accountSettings } } = context;
        const selected = accountSettings.filter((accountSetting) => accountSetting.account_id === data.id)[0];
        if (selected) {
          return (
            <table>
              <tr>
                <th style={{width: "30%"}}></th>
                <th></th>
              </tr>
              <tr>
                <td><Text strong>Create type</Text></td> 
                <td>: {selected.create_type === "create_only" ? "Create only" : "Create & post"}</td>
              </tr>
              <tr>
                <td><Text strong>Timer setting</Text></td> 
                <td>: {selected.timer_setting === "not" ? "No setting" : moment(selected.timer_setting).format(format)}</td>
              </tr>
            </table>
          )
        }
        return <Text strrong>No selected</Text>
      } },

    ]
  }

  return {
    context: context.state,
    state,
    action,
    value
  }

}

export default useAccountSettingHook;