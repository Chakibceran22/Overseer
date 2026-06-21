
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
      <Routes>
        <Route path='/' element={<Login/>} /  >
      </Routes>
    </Router>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    
  )
}

export default App
