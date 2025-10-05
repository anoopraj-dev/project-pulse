import { BrowserRouter as Router,Routes, Route} from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import Signup from "./pages/Signup"

const App = () => {
  return (
    <Router>
      <div>
        <Navbar/>
      </div>
      <Routes>
           <Route path="/" element={<Home/>}/>
           <Route path="/signin" element= {<SignIn/>} />
           <Route path="/signup" element= {<Signup/>} />
      </Routes>
     
    </Router>
  )
}

export default App
