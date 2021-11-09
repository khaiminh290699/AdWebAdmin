import React, { useContext, useEffect, useState } from "react";
import {EditorState, ContentState, convertToRaw} from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import draftToHtml from 'draftjs-to-html';
import { useHistory, useParams } from "react-router";
import Api from "../../api";
import useAppContext from "../../App.context";
import { Button, Tag, Space, Typography } from "antd";
import PasswordHidden from "../account-manage/password";
import WebTooltip from "../web-tooltip";
import moment from "moment";

const { Text, Link } = Typography;

function usePostUpdateHook(props = {}) {

  const format = "HH:mm";

  const api = new Api();

  const params = useParams();
  const history = useHistory();

  const context = useContext(useAppContext);

  const [state, setState] = useState({
    link: null,
    title: null,
    content: null,
    editorState: EditorState.createEmpty(),
    accountSettings: [],
    uploadedFiles: [],
    backlinks: [],
    error: {},
    accounts: [],
    account: null,
    setting: null,
    forums: [],
    selectingForum: null
  });

  useEffect(async () => {
    const { id } = params;

    const rs = await api.getOnePost(id);

    if (rs.status != 200) {
      return;
    }

    const { data: { post, accountSettings, forums } } = rs;

    const { title, content } = post;

    // const { user } = context.state;
    const user = JSON.parse(localStorage.getItem("user"))
    
    state.title = title;
    state.content = content;
    state.forums = forums;
    state.editorState = EditorState.createWithContent(
      ContentState.createFromBlockArray(
        DraftPasteProcessor.processHTML(content)
      )
    )
    state.accountSettings = accountSettings;
    setState({ ...state })

    const res = await api.listAccounts([{ user_id: { $eq: user.id } }]);
    if (res.status != 200) {
      return;
    }

    const { data: { accounts } } = res;
    state.accounts = accounts;
    setState({ ...state })
  }, [])

  const action = {
    onTitleChange: (value) => {
      setState({ ...state, title: value });
    },

    onEditorStateChange: (editorState) => {
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      setState({ ...state, content, editorState });
    },

    onUploadCallback: async (file) => {
      const { path, filename } = await api.uploadApi(file);
      state.uploadedFiles.push(filename);
      setState({ ...state });
      return { data: { link: `${process.env.REACT_APP_API_HOST}/${path}` } }
    },

    onLinkInputChange: (value) => {
      setState({ ...state, link: value });
    },

    onAddLink: async () => {
      if (!state.link) {
        state.error.link = "Link is required!"
        setState({ ...state });
        return;
      }
      const rs = await api.createBackLink(state.link);
      if (rs.status != 200) {
        return;
      }
      const { data: { backlink } } = rs;
      const { id, link_url } = backlink;

      const str = window.location.href.split("/");
      state.content += `<a href='${str[0]}//${str[2]}/redirect/${backlink.id}/:post_id/:forum_id/:setting_id/:type'>${link_url}</a>`;
      state.backlinks.push(id);
      state.editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          DraftPasteProcessor.processHTML(state.content)
        )
      );
      setState({ ...state });
    },

    onAccountSelectChange: (value) => {
      setState({ ...state, account: value });
    },

    onSelectAccount: () => {
      const account = state.accounts.filter((account) => account.id === state.account)[0];
      state.accountSettings.push({
        account_id: state.account,
        username: account.username,
        password: account.password,
        web_key: account.web_key,
        web_url: account.web_url,
        web_id: account.web_id,
        web_name: account.web_name,
        forumSettings: [...state.forums.filter((forum) => forum.web_key === account.web_key)],
        timerSettings: [],
        is_create_only: true,
        is_update: true
      })
      state.account = null;
      setState({ ...state, accountSettings: [...state.accountSettings] })
    },

    onRemoveSetting: (index) => {
      state.accountSettings.splice(index, 1);
      setState({ ...state, accountSettings: [...state.accountSettings] })
    },

    onSettingClick: (index) => {
      const accountSetting = state.accountSettings[index];
      state.setting = accountSetting;
      setState({ ...state })
    },

    onCancel: () => {
      setState({ ...state, setting: null, selectingForum: null })
    },

    onSelectForumChange: (value) => {
      setState({ ...state, selectingForum: value })
    },

    onAddForum: () => {
      if (!state.selectingForum) {
        return;
      }
      if (state.setting.forumSettings.some((forum) => forum.forum_id === state.selectingForum)) {
        return;
      }
      const forum = state.forums.filter((selectedForum) => selectedForum.forum_id === state.selectingForum)[0];
      state.setting.forumSettings.push(forum);
      setState({ ...state, selectingForum: null })
    },

    onRemoveForum: (event, index) => {
      event.preventDefault();
      if (!(state.setting.forumSettings.length -1 )) {
        alert("This is the last forum!");
        return;
      }
      if (!state.setting.setting_id) {
        state.setting.forumSettings.splice(index, 1);
      }
      setState({ ...state })
    },

    onAddTimer: () => {
      state.setting.timerSettings.push({
        timer_at: moment(),
        from_date: moment().startOf("date"),
        to_date: moment().endOf("date")
      })
      setState({ ...state })
    },

    onTimeChange: (value, index) => {
      state.setting.timerSettings[index].timer_at = value;
      setState({ ...state })    },

    onTimeRangeChange: (value, index) => {
      state.setting.timerSettings[index].from_date = value[0].startOf("date");
      state.setting.timerSettings[index].to_date = value[1].endOf("date");
      setState({ ...state })
    },

    onRemoveTimer: (index) => {
      state.setting.timerSettings.splice(index, 1);
      setState({ ...state })
    },

    onUpdate: async () => {
      const { id } = params;
      const { title, content, accountSettings } = state;
      const post = {
        id,
        title,
        content
      }

      await api.updatePost(post, accountSettings);
      history.go(0);
    }

  }

  const value = {
    accountColumns: [
      { title: "Account", width: "10%", render: (data) => <Text>{data.username}</Text> },
      { title: "Password",  width: "15%", render: (data) => <PasswordHidden password={data.password} /> },
      { title: "Website",  width: "15%", render: (data) => <WebTooltip web={data}><Link href={data.web_url}>{data.web_name}</Link></WebTooltip> },
      { title: "Setting",  width: "25%", render: (data,  _, index) => {
        return (
          <Space>
            <Button onClick={() => action.onSettingClick(index)} type="primary">Setting</Button>
            {
              data.is_update ? <Button type="danger" onClick={() => action.onRemoveSetting(index)}>Remove</Button> : null
            }
          </Space>
        )
      } },
      { title: "Desciprtion", render: (data) => {
        return (
          <>
            {
              data.is_create_only ? 
              <p>
                <Text type="secondary" italic >(create only)</Text>
              </p>
              :null
            }
            {
              data.forumSettings.length ?
              <>
                <p/>
                <Text strong>Forums setting :</Text>
                <div>
                  {
                    data.forumSettings.map((forum) => {
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
              data.timerSettings.length ?
              <>
                <p/>
                <Text strong>Timer setting :</Text>
                <div>
                  {
                    data.timerSettings.map((timer) => {
                      return (
                        <div>
                          - <Text strong>{moment(timer.timer_at).isValid() ? moment(timer.timer_at).format(format) : timer.timer_at}</Text>, from <Text strong>{moment(timer.from_date).format("DD/MM/YYYY")}</Text> to <Text strong>{moment(timer.to_date).format("DD/MM/YYYY")}</Text>
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
      } },

    ]
  }

  return {
    state,
    action,
    value
  }
}

export default usePostUpdateHook;