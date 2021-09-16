import React from 'react';
import Editor from './components/Editor';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MyDashboard from './pages/MyDashboard';

const EditorContainer = styled.div`
    border:1px solid #000;
`;

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <div className="app">
            <EditorContainer>
              <Editor />
            </EditorContainer>
          </div>
        </Route>
        <Route path="/login" exact>
          <MyDashboard />
        </Route>
        <Route path="/my-dashboard" exact>
          <MyDashboard />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
