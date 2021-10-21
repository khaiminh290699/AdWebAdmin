import { Tooltip, Typography } from "antd";
import React from "react";

const { Text, Link } = Typography;

function WebTooltip(props) {
  const { web } = props;
  return (
    <Tooltip title={
      <table>
        <tr>
          <td><Text strong>URL :</Text></td>
          <td><Link href={web.url}>{web.url}</Link></td>
        </tr>
        <tr>
          <td><Text strong>Web name :</Text></td>
          <td><Text>{web.name}</Text></td>
        </tr>
        <tr>
          <td><Text strong>Key :</Text></td>
          <td><Text type="secondary">{web.key}</Text></td>
        </tr>
      </table>
    } ><Text strong>{web.name}</Text></Tooltip>
  )
}

export default WebTooltip;