import React from "react";
import { Tooltip, Typography } from "antd";

const { Text, Link } = Typography;

function WebTooltip(props) {
  const web = props.web || { web_url: null, web_key: null, web_name: null }
  return (
    <Tooltip title={
      <table>
        <tr>
          <td><Text strong>URL :</Text></td>
          <td><Link href={web.web_url}>{web.web_url}</Link></td>
        </tr>
        <tr>
          <td><Text strong>Web name :</Text></td>
          <td><Text>{web.web_name}</Text></td>
        </tr>
        <tr>
          <td><Text strong>Key :</Text></td>
          <td><Text type="secondary">{web.web_key}</Text></td>
        </tr>
      </table>
    } >{props.children}</Tooltip>
  )
}

export default WebTooltip;