import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/Home'
import MainLayout from './Layout/Mainlayout';
import ProfilePage from './containers/Profile'
import './App.css'

function App() {
  return (


    <Router>
      <MainLayout >

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      </MainLayout>
    </Router>
      
  )
}

export default App
