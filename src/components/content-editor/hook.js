import React, { useContext, useState } from "react";
import {EditorState, ContentState, convertToRaw} from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import draftToHtml from 'draftjs-to-html';
import Api from "../../api";
import usePostContext from "../post-create/context";

function useContentEditorHook() {
  const api = new Api();
  const context = useContext(usePostContext);
  const [state, setState] = useState({
    editorState: context.state.content ? 
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          DraftPasteProcessor.processHTML(context.state.content)
        )
      )
      :
      EditorState.createEmpty(),

    error: {},
    link: null
  })

  const action = {
    onTitleChange: (title) => {
      context.dispatch({ data: { title } })
    },

    onEditorStateChange: (editorState) => {
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      context.dispatch({ data: { content } })
      setState({ ...state, editorState })
    },

    onUploadCallback: async (file) => {
      const { state: { uploadedFiles } } = context;
      const { path, filename } = await api.uploadApi(file);
      uploadedFiles.push(filename);
      context.dispatch({ data: { uploadedFiles } })
      return { data: { link: `${process.env.REACT_APP_API_HOST}/${path}` } }
    },

    onNext: (pageProgressing) => {
      if (pageProgressing === "account") {
        const { state: { title, content } } = context;
        if (!title) {
          state.error["title"] = "Tilte mustn't be empty";
        } else if (title.length < 36) {
          state.error["content"] = "Title mustn't be longer then 12 characters";
        }  else {
          delete state.error["title"];
        }

        if (!content) {
          state.error["content"] = "Content mustn't be empty";
        } else if (content.length < 36) {
          state.error["content"] = "Content mustn't be longer then 36 characters";
        } else {
          delete state.error["content"];
        }
      }
      if (Object.keys(state.error).length > 0) {
        setState({ ...state });
        return;
      }
      context.dispatch({ type: "pageProgressing", data: { pageProgressing } });
    },

    onLinkInputChange: (link) => {
      setState({ ...state, link })
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
      context.state.content += `<a href='${str[0]}//${str[2]}/redirect/${backlink.id}/:post_id/:forum_id/:setting_id/:type'>${link_url}</a>`;
      context.state.backlinks.push(id);
      context.dispatch({ data: { content: context.state.content, backlinks: context.state.backlinks } });
      state.editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          DraftPasteProcessor.processHTML(context.state.content)
        )
      );
      setState({ ...state });
    }
  }

  return {
    context: context.state,
    state,
    action
  }
}

export default useContentEditorHook;