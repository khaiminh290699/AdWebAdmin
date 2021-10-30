import { Button, Checkbox, Space, Typography } from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import Api from "../../api";
import PasswordHidden from "../account-manage/password";
import usePostContext from "../post-create/context";
import WebTooltip from "../web-tooltip";
import Socket from "../../socket"

const { Text, Link } = Typography;

function useAccountSettingHook() {
  const api = new Api();
  const format = "HH:mm";
  const context = useContext(usePostContext);
  const [state, setState] = useState({ isLoading: true, accounts: [], setting: null, reload: true, progressing: null, error: null });

  useEffect(async () => {
    if (state.reload) {
      const { state: { selectedForums, accountSettings } } = context;
      const rs = await api.listAccounts([{ web_key: { $in: selectedForums.map((selectedForum) => selectedForum.web_key) } }], { web_name: 1 });
      
      if (rs.status != 200) {
        return;
      }

      const { data: { accounts } } = rs;

      setState({ ...state, isLoading: false, accounts, reload: false })
      context.dispatch({ data: { accountSettings: accountSettings.filter((accountSetting) => !accounts.some((account) => account.id === accountSetting.account_id) ) } })
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
            timers: []
          })
        }
      } else {
        if (index != -1) {
          accountSettings.splice(index, 1)
        }
      }
      context.dispatch({ data: { accountSettings: [...accountSettings] } })

    },

    onSettingClick: (account) => {
      setState({ ...state, setting: account });
    },

    onCancel: () => {
      setState({ ...state, setting: null })
    },

    onCheck: (checked, type, value) => {
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
      context.dispatch({ data: { accountSettings: [...context.state.accountSettings] }})
    },

    onReload: () => {
      setState({ ...state, reload: true })
    },

    onNext: (pageProgressing) => {
      context.dispatch({ type: "pageProgressing", data: { pageProgressing } });
    },

    onAddTimer: () => {
      const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      setting.timers.push({
        timer_at: moment(),
        from_date: moment().startOf("date"),
        to_date: moment().endOf("date")
      })
      context.dispatch({ data: { accountSettings: [...context.state.accountSettings] }})
    },

    onCreatePost: async () => {
      const { content, title, selectedForums, accountSettings } = context.state;
      const post = {
        content, title
      }
      const forums = selectedForums.map((selectedForum) => selectedForum.id);
      const settings = accountSettings;
      setState({ ...state, isLoading: true })
      const rs = await api.createPost(post, forums, settings);
      if (rs.status != 200) {
        setState({ ...state, isLoading: false, error: rs.message });
        return;
      }
      const { data } = rs;
      if (data.progressing) {
        context.dispatch({ data: { progressing: data.progressing, pageProgressing: "progressing" } })
        return;
      }
      context.dispatch({ data: { pageProgressing: "created" } })
    },

    onTimeChange: (value, index) => {
      const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      setting.timers[index].timer_at = value;
      console.log(context.state.accountSettings);
      context.dispatch({ data: { accountSettings: [...context.state.accountSettings] }})
    },

    onTimeRangeChange: (value, index) => {
      const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      setting.timers[index].from_date = value[0].startOf("date");
      setting.timers[index].to_date = value[1].endOf("date");
      context.dispatch({ data: { accountSettings: [...context.state.accountSettings] }})
    },

    onRemoveTimerSetting: (index) => {
      const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      setting.timers.splice(index, 1);
      context.dispatch({ data: { accountSettings: [...context.state.accountSettings] }})
    }
  }

  const value = {
    accountColumns: [
      { title: "Selected", width: "1%", render: (data) => <Checkbox disabled={data.disable} checked={context.state.accountSettings.some((accountSetting) => accountSetting.account_id === data.id)} onChange={(event) => action.onSelectAccount(event.target.checked, data.id)} /> },
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
            <>
              <Space>
                <Text strong>Create type</Text> :{selected.create_type === "create_only" ? "Create only" : "Create & post"}
              </Space>
              {
                selected.timers.length ?
                <>
                  <p/>
                  <Text strong>Timer setting :</Text>
                  <ul>
                    {
                      selected.timers.map((timer) => {
                        return <li>At <Text strong>{moment(timer.timer_at).format(format)}</Text>, from date  <Text strong>{moment(timer.from_date).format("DD/MM/YYYY")}</Text> to  <Text strong>{moment(timer.to_date).format("DD/MM/YYYY")}</Text></li>
                      })
                    }
                  </ul>
                </>
                :
                null
              }
            </>
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