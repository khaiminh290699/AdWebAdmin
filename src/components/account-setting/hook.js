import { Button, Checkbox, Space, Typography, Tag } from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import Api from "../../api";
import PasswordHidden from "../account-manage/password";
import usePostContext from "../post-create/context";
import WebTooltip from "../web-tooltip";

const { Text, Link } = Typography;

function useAccountSettingHook() {
  const api = new Api();
  const format = "HH:mm";
  const context = useContext(usePostContext);
  const [state, setState] = useState({ isLoading: true, accounts: [], forums: [], setting: null, reload: true, progressing: null, error: null, selectingForum: null });

  useEffect(async () => {
    if (state.reload) {
      const { state: { selectedForums, accountSettings } } = context;
      const rs = await api.listAccounts([{ web_key: { $in: selectedForums.map((selectedForum) => selectedForum.web_key) } }], { web_name: 1 });
      
      if (rs.status != 200) {
        return;
      }

      const { data: { accounts } } = rs;

      const rs2 = await api.listForums([{ "forums.id": { $in: selectedForums.map((selectedForum) => selectedForum.id) } }], { forum_name: 1 })
      const { data: { forums } } = rs2;

      setState({ ...state, isLoading: false, accounts, forums, reload: false })
      context.dispatch({ data: { accountSettings: accountSettings.filter((accountSetting) => !accounts.some((account) => account.id === accountSetting.account_id) ) } })
    }
  }, [state.reload])

  const action = {
    onSelectAccount: (checked, account_id) => {
      const { state: { accountSettings, selectedForums } } = context;
      const index = accountSettings.findIndex(accountSetting => accountSetting.account_id === account_id);
      const account = state.accounts.filter((account) => account.id === account_id)[0];
      if (checked) {
        if (index === -1) {
          accountSettings.push({
            account_id,
            web: { id: account.web_id, key: account.web_key },
            forums: [...selectedForums.filter((forum) => forum.web_key === account.web_key)],
            timers: [],
            is_create_only: false
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
      setState({ ...state, setting: null, selectingForum: null })
    },

    // onCheck: (checked, type, value) => {
    //   const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
    //   if (!checked) {
    //     if (type === "create_type") {
    //       if (value === "create_only") {
    //         value = "create_and_post"
    //       } else {
    //         value = "create_only"
    //       }
    //     }

    //     if (type === "timer_setting") {
    //       value = moment().set("millisecond", 0).set("second", 0).set("millisecond", 0).toDate();
    //     }
    //   }
    //   setting[type] = value;
    //   context.dispatch({ data: { accountSettings: [...context.state.accountSettings] }})
    // },

    onReload: () => {
      setState({ ...state, reload: true })
    },

    onNext: (pageProgressing) => {
      context.dispatch({ type: "pageProgressing", data: { pageProgressing } });
    },

    onSelectForumChange: (value) => {
      setState({ ...state, selectingForum: value });
    },

    onAddForum: () => {
      if (!state.selectingForum) {
        return;
      }
      const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      if (setting.forums.some((forum) => forum.id === state.selectingForum)) {
        return;
      }
      const forum = context.state.selectedForums.filter((selectedForum) => selectedForum.id === state.selectingForum)[0];
      setting.forums.push(forum);
      context.dispatch({ data: { accountSettings: [...context.state.accountSettings] }})
    },

    onRemoveForum: (event, index) => {
      event.preventDefault();
      const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      if (!setting.forums.length || !(setting.forums.length - 1)) {
        alert("This is the last forum!");
        return;
      }
      setting.forums.splice(index, 1);
      context.dispatch({ data: { accountSettings: [...context.state.accountSettings] }})
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

    onRemoveTimer: (index) => {
      const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      setting.timers.splice(index, 1);
      context.dispatch({ data: { accountSettings: [...context.state.accountSettings] }})
    },

    onCreatePost: async () => {
      const { content, title, selectedForums, accountSettings, backlinks } = context.state;
      const post = {
        content, title
      }
      const forums = selectedForums.map((selectedForum) => selectedForum.id);
      const settings = accountSettings;
      setState({ ...state, isLoading: true })
      const rs = await api.createPost(post, forums, settings, backlinks);
      if (rs.status != 200) {
        setState({ ...state, isLoading: false, error: rs.message });
        return;
      }
      const { data } = rs;
      if (data.progressing) {
        context.dispatch({ data: { progressing: data.progressing, pageProgressing: "progressing", backlinks: [], uploadedFiles: [] } })
        return;
      }
      context.dispatch({ data: { pageProgressing: "created", backlinks: [], uploadedFiles: [] } })
    },

    onTimeChange: (value, index) => {
      const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      setting.timers[index].timer_at = value;
      context.dispatch({ data: { accountSettings: [...context.state.accountSettings] }})
    },

    onTimeRangeChange: (value, index) => {
      const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      setting.timers[index].from_date = value[0].startOf("date");
      setting.timers[index].to_date = value[1].endOf("date");
      context.dispatch({ data: { accountSettings: [...context.state.accountSettings] }})
    },

    onCheckCreateOnly: (event) => {
      const checked = event.target.checked;
      const setting = context.state.accountSettings.filter((accountSetting) => accountSetting.account_id === state.setting.id)[0];
      setting.is_create_only = checked;
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
              {
                selected.is_create_only ? 
                <p>
                  <Text type="secondary" italic >(create only)</Text>
                </p>
                :null
              }
              {
                selected.forums.length ?
                <>
                  <p/>
                  <Text strong>Forums setting :</Text>
                  <div>
                    {
                      selected.forums.map((forum) => {
                        return (
                          <Tag>{forum.forum_name}</Tag>
                        )
                      })
                    }
                  </div>
                </>
                :
                null
              }
              {
                selected.timers.length ?
                <>
                  <p/>
                  <Text strong>Timer setting :</Text>
                  <div>
                    {
                      selected.timers.map((timer) => {
                        return (
                          <div>
                            - <Text strong>{moment(timer.timer_at).format(format)}</Text>, from <Text strong>{moment(timer.from_date).format("DD/MM/YYYY")}</Text> to <Text strong>{moment(timer.to_date).format("DD/MM/YYYY")}</Text>
                          </div>
                        )
                      })
                    }
                  </div>
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