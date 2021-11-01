import { Spin, Typography } from "antd";
import React from "react";
import { Redirect } from "react-router-dom";
import useBackLinkHook from "./hook";

function BackLink() {
  const { state } = useBackLinkHook();
  if (state.error) {
    return <Typography.Text strong type="danger">{state.error}</Typography.Text>
  }
  if (state.backlink) {
    window.location.replace(state.backlink.link_url)
    return <></>
  }
  return <Spin />
}

export default BackLink;