import { BrowserRouter as Router,Routes, Route} from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"

const App = () => {
  return (
    <Router>
      <div>
        <Navbar/>
      </div>
      <Routes>
           <Route path="/" element={<Home/>}/>
      </Routes>
     
    </Router>
  )
}

export default App
