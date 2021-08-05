import './App.css';
import LogInPage from "./components/LogInPage/LogInPage";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CollectionDisplay from './components/CollectionDisplay/CollectionDisplay';
import CollectionCreator from './components/CollectionCreator/CollectionCreator';
import CollectionViewer from './components/CollectionViewer/CollectionViewer';
import CollectionEditor from './components/CollectionEditor/CollectionEditor';




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
          <Route path="/createNewCollection">
            <CollectionCreator/>
          </Route> 
          <Route path="/collection/edit/:id">
            <CollectionEditor/>
          </Route> 
          <Route path="/collection/:id">
            <CollectionViewer/>
          </Route> 
          <Route path="/">
            
              <CollectionDisplay/>
          </Route>      
        </Switch>
      </div>
    </Router>
  );
}

export default App;
