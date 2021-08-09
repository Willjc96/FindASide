import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import HomePage from './Pages/Homepage';
function App() {
  return (
    <Router>
      <Route exact path='/' component={HomePage} />
      <Redirect from='*' to='/' />
    </Router>
  );
}

export default App;
