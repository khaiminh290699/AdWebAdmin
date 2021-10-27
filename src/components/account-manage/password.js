import { Space, Typography} from "antd";
import React, { useState } from "react";

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const { Text } = Typography;

function PasswordHidden(props) {
  let [state, setState] = useState({ isDisplay: false });
  return (
    <Space size="middle">
      {
        state.isDisplay ? <Text type="secondary">{new Buffer(props.password, "base64").toString("ascii")}</Text> : <Text italic>Hidden</Text>
      }
      {
        state.isDisplay ? <EyeInvisibleOutlined onClick={() => setState({ ...state, isDisplay: false })} /> : <EyeOutlined onClick={() => setState({ ...state, isDisplay: true })} /> 
      }
    </Space>
  )
}

export default PasswordHidden;