import "antd/dist/antd.css";
import "./App.css"
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import useAppContext from "./App.context";
import useAppHook from "./App.hook";

import AccountManage from "./components/account-manage";
import Login from "./components/login";
import MenuLayout from "./components/menu";
import PostCreate from "./components/post-create";
import PostManage from "./components/post-manage";
import PostTimer from "./components/post-timer";
import Progressing from "./components/progressing";
import PostDetail from "./components/post-detail";
import UserManage from "./components/user-manage";
import BackLink from "./components/backlink";

function App() {

  const { state, dispatch } = useAppHook();

  const redirect = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return (
        <Switch>
          <Route path="/user/manage">
            <UserManage />
          </Route>
          <Route path="/account/manage">
            <AccountManage />
          </Route>
          <Route path="/post/manage">
            <PostManage />
          </Route>
          <Route path="/timer/post">
            <PostTimer />
          </Route>
          <Route path="/post/create">
            <PostCreate />
          </Route>
          <Route path="/post/:id">
            <PostDetail />
          </Route>
          <Route path="/progressing/:id">
            <Progressing />
          </Route>
          <Route path="/">
            <div></div>
          </Route>
        </Switch>
      )
    }

    return <Redirect to="/auth/login" />
  }
  return (
    <useAppContext.Provider value={{ state, dispatch }}>
      <Router>
        <Switch>
          <MenuLayout>
          
            <Route path="/auth/login">
              <Login />
            </Route>
            <Switch>
              <Route path="/redirect/:backlink_id/:post_id/:forum_id/:setting_id/:type/:timer_at">
                <BackLink />
              </Route>
              <Route path="/redirect/:backlink_id/:post_id/:forum_id/:setting_id/:type">
                <BackLink />
              </Route>
            </Switch>
            <Route render={redirect}>
            </Route>
          
          </MenuLayout>
        </Switch>
      </Router>
    </useAppContext.Provider>
  );
}

export default App;
