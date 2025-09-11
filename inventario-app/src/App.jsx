import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Locais from './pages/Locais';
import Patrimonios from './pages/Patrimonios';
import Inventory from './pages/Inventory';
import Layout from './components/Layout';
import Sessoes from './pages/Sessoes';
import ItensConferidos from './pages/ItensConferidos';

function App() {

  return (
    <BrowserRouter>
      <Routes>        
        <Route path="/" element={<Layout />}>
             <Route index element={<Dashboard />} />                          
             <Route path="/admin/users" element={<Users />} />
             <Route path="/admin/locais" element={<Locais />} />
             <Route path="/admin/patrimonios" element={<Patrimonios />} />
             <Route path="/admin/sessoes" element={<Sessoes />} />             
             <Route path="/admin/itens-conferidos" element={<ItensConferidos />} />
             <Route path="/employee/inventory/:localId" element={<Inventory />} />
             <Route path="/employee/conferencias" element={<ItensConferidos />} />    
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;