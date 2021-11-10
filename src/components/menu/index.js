import React, { useContext } from "react";
import { Layout, Menu, Typography } from 'antd';
import { Link } from "react-router-dom";
import useAppContext from "../../App.context";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

function MenuLayout(props) {

  const context = useContext(useAppContext);

  const headerMenu = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"))
      return (
        <>
          <Menu.Item disabled={true}>
            <Text strong style={{ color: "white", float: "right" }}>Hi! {user.username}</Text>
          </Menu.Item>
          <Menu.Item>
            <Text strong style={{ color: "#bfbfbf", float: "right" }}>LogOut</Text>
          </Menu.Item>
        </>
      )
    } else {
      return <Menu.Item>
        <Link style={{ color: "white", fontWeight: "bold" }} to="/auth/login">
          LogIn
        </Link>
      </Menu.Item>
    }
  }

  const siderBar = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return (
        <>
          <Menu.Item>
            <Link style={{ color: "black", fontWeight: "bold" }} to="/web/manage">
              Web
            </Link>
          </Menu.Item>
          {
            context.state.user && context.state.user.isAdmin ? 
            <Menu.Item>
              <Link style={{ color: "black", fontWeight: "bold" }} to="/user/manage">
                User
              </Link>
            </Menu.Item>
            :
            null
          }
          <Menu.Item>
            <Link style={{ color: "black", fontWeight: "bold" }} to="/account/manage">
              Account
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link style={{ color: "black", fontWeight: "bold" }} to="/post/manage">
              Post
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link style={{ color: "black", fontWeight: "bold" }} to="/timer/post">
              Timer
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link style={{ color: "black", fontWeight: "bold" }} to="/statistic">
              Statistic
            </Link>
          </Menu.Item>
        </>
      )
    }
  }

  return (
    <Layout style={{minHeight:"100vh"}}>
      <Header className="header">
        <div className="logo" />
        <Menu style={{float: 'right' }} theme="dark" mode="horizontal">
          {headerMenu()}
        </Menu>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ height: '100%', borderRight: 0 }} >
            {siderBar()}
          </Menu>
        </Sider>
        <Layout>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
          <Content
            className="site-layout-background scrollable-container"
            style={{
              padding: 24,
              margin: 0,
              height: 600,
              overflow: "auto",
            }}
          >
            {
              props.children
            }
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default MenuLayout;