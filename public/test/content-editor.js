import React, { useEffect, useState } from "react";
import { Card, Divider, Input, Typography } from "antd";
import { Editor } from "react-draft-wysiwyg";
import {EditorState, ContentState, convertToRaw} from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Api from "../../api";

const { Text } = Typography; 

function ContentEditor(props) {
  const api = new Api();

  const { content, title, onStateChange, uploadedFiles } = props;

  const [state, setState] = useState({ 
    editorState: content ? 
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          DraftPasteProcessor.processHTML(content)
        )
      )
      :
      EditorState.createEmpty()
    }
  )


  const onUploadCallback = async (file) => {
    const { path, filename } = await api.uploadApi(file);
    uploadedFiles.push(filename);
    onStateChange({ uploadedFiles })
    return { data: { link: `${process.env.REACT_APP_API_HOST}/${path}` } }
  }

  const onEditorStateChange = (editorState) => {
    onStateChange({
      content: draftToHtml(convertToRaw(editorState.getCurrentContent()))
    })
    setState({ ...state, editorState })
  }

  return (
    <Card title="Content">
      <Text strong>Title :</Text>
      <Input value={title} onChange={(event) => onStateChange({ title: event.target.value })} />
      <Divider/>
      <Editor
        editorState={state.editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={
            {
                image: { uploadCallback: onUploadCallback, alt: { present: true, mandatory: true } },
            }
        }
      ></Editor>
    </Card>
  )
}

export default ContentEditor;