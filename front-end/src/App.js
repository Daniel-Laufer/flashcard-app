import './App.css';
import LogInPage from "./components/LogInPage/LogInPage";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login">
              <LogInPage/>
          </Route>
          <Route path="/register">
              <RegistrationPage/>
          </Route>    
          <Route path="/">
              heyo
          </Route>      
        </Switch>
      </div>
    </Router>
  );
}

export default App;
