import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import HomePage from './Pages/Homepage';
import GamePage from './Pages/GamePage';
import Header from './Components/Header';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import 'semantic-ui-css/semantic.min.css';
import { UserContextProvider } from './Context/UserContext';

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/games/*' component={GamePage} />
          <Route path='/login' component={LoginPage} />
          <Route path='/signup' component={SignupPage} />
          <Redirect from='*' to='/' />
        </Switch>
      </Router>
    </UserContextProvider>
  );
}

export default App;
