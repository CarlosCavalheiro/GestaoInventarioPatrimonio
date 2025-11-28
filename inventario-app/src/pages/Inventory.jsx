import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/Constantes';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { decodeToken } from '../utils/Auth';
import CameraQR from '../components/CameraQR';  
import JustifyModal from '../components/JustifyModal';

function Inventory() {
  const [isOpen, setIsOpen] = useState(true);
  const [isOpenFora, setIsOpenFora] = useState(true);
  const [isOpenLocal, setIsOpenLocal] = useState(true);

  const { localId } = useParams();
  const navigate = useNavigate();

  // Estados principais
  const [patrimonios, setPatrimonios] = useState([]);
  const [conferidos, setConferidos] = useState([]);  
  const [inconsistencias, setInconsistencias] = useState([]);
  const [inconsistencias_meu_local, setInconsistenciasMeuLocal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSessionId, setActiveSessionId] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  
  // Controle do formulário
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [form, setForm] = useState({
    numeroPatrimonio: '',
    placaIdentificacaoOk: true,
    observacao: '',
    photo: null,
  });
  
  const [formErrors, setFormErrors] = useState({
    numeroPatrimonio: '',
    photo: ''
  });
  
  // Dados consultados da API
  const [patrimonioInfo, setPatrimonioInfo] = useState(null);
  const [erroConsulta, setErroConsulta] = useState('');
  
  // Referências para câmera
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  
  //Estado para modal de justificativa
  const [isJustifyModalOpen, setIsJustifyModalOpen] = useState(false);
  const [itemToJustify, setItemToJustify] = useState(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleOpenFora = () => {
    setIsOpenFora(!isOpenFora);
  };
  const toggleOpenLocal = () => {
    setIsOpenLocal(!isOpenLocal);
  };

   // Ícones para o botão de toggle
  const ChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  const ChevronUp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  );

  // Carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const sessaoResponse = await fetch(`${API_URL}/SessoesConferencia/ativa`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!sessaoResponse.ok) throw new Error('Falha ao buscar sessão ativa.');
        
        const sessaoData = await sessaoResponse.json();
        const activeSessionId = sessaoData;
        setActiveSessionId(activeSessionId);

        if (!activeSessionId) {
          setError('Nenhuma sessão de conferência está ativa. Avise o administrador.');
          setLoading(false);
          return;
        }

        const [patrimoniosResponse, conferidosResponse, inconsistenciasResponse, inconsistenciasMeuLocalResponse] = await Promise.all([
          fetch(`${API_URL}/Patrimonios/meus-patrimonios?localId=${localId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`${API_URL}/ItensConferidos/conferidos?sessaoId=${activeSessionId}&localId=${localId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`${API_URL}/ItensConferidos/inconsistencias?sessaoId=${activeSessionId}&localId=${localId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`${API_URL}/ItensConferidos/inconsistencias-meu-local?sessaoId=${activeSessionId}&localId=${localId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);

        if (!patrimoniosResponse.ok) throw new Error('Falha ao buscar patrimônios.');
        const patrimoniosData = await patrimoniosResponse.json();        
        setPatrimonios(patrimoniosData);
        
        const conferidosData = await conferidosResponse.json();
        const numerosConferidos = conferidosData.map(item => item);                
        setConferidos(numerosConferidos);        
        
        const inconsistenciasData = await inconsistenciasResponse.json();
        setInconsistencias(inconsistenciasData);

        const incosistenciasMeuLocalData = await inconsistenciasMeuLocalResponse.json();
        setInconsistenciasMeuLocal(incosistenciasMeuLocalData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [localId, navigate]);

  // Consulta API /api/Patrimonios sempre que numeroPatrimonio mudar
  useEffect(() => {
    const fetchPatrimonio = async () => {
      if (!form.numeroPatrimonio) {
        setPatrimonioInfo(null);
        setErroConsulta('');
        return;
      }
      try {
        setErroConsulta('');
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/Patrimonios?numeroPatrimonio=${form.numeroPatrimonio}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Falha ao buscar patrimônio.');
        const data = await response.json();
        if (data && data.length > 0) {
          setPatrimonioInfo(data[0]);
        } else {
          setPatrimonioInfo(null);
          setErroConsulta('Patrimônio não encontrado.');
        }
      } catch (err) {
        setPatrimonioInfo(null);
        setErroConsulta('Erro ao consultar patrimônio.');
      }
    };
    fetchPatrimonio();
  }, [form.numeroPatrimonio]);

  // Leitura do QR Code
  useEffect(() => {
    if (!isManualEntry) {
      const interval = setInterval(() => {
        if (webcamRef.current && canvasRef.current) {
          const video = webcamRef.current.video;
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          
          if (video.readyState === 4) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code && code.data) {
              // Extrair apenas os números antes do hífen (se existir)
              const raw = code.data.trim();
              const numeroPatrimonio = raw.includes('-') 
                ? raw.split('-')[0].trim() 
                : raw;

              if (numeroPatrimonio !== form.numeroPatrimonio) {
                setForm(prevForm => ({ 
                  ...prevForm, 
                  numeroPatrimonio, 
                  placaIdentificacaoOk: true 
                }));
              }
            }
          }
        }
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isManualEntry, form.numeroPatrimonio]);

  // Alternar modo de entrada
  const toggleEntryMode = () => {
    setIsManualEntry(prev => {
      const novoModo = !prev;
      setForm(f => ({ 
        ...f, 
        placaIdentificacaoOk: novoModo ? false : true
      }));
      return novoModo;
    });
  };

  // Abrir modal de justificativa
  const openJustifyModal = (item) => {
    setItemToJustify(item);
    setIsJustifyModalOpen(true);
  };

  // Submeter justificativa
  const handleJustifySubmit = async (justificativa) => {
    const token = localStorage.getItem('token');
    //const userIdFromToken = decodeToken(token)?.userId;

    const justificativaData = {
      sessaoId: activeSessionId,
      numeroPatrimonio: itemToJustify.numeroPatrimonio,
      localEncontradoId: parseInt(localId),
      justificativa: justificativa,
      //conferidoPorId: userIdFromToken,
    };

    //console.log('Justificativa enviada:', justificativaData);

    try {
      const response = await fetch(`${API_URL}/ItensConferidos/justificar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(justificativaData),
      });

      if (!response.ok) throw new Error('Falha ao justificar item.');

      alert('Item justificado com sucesso!');
      //setConferidos(prev => [...prev, form.numeroPatrimonio]);                              
      setConferidos(prev => [...prev, { numeroPatrimonio: itemToJustify.numeroPatrimonio, status: 'justificado' }]);
      setIsJustifyModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Alterar manualmente o número
  const handleManualChange = (e) => {
    setForm({ ...form, numeroPatrimonio: e.target.value });
  };
  
  const handlePhotoChange = (e) => {
    setForm({ ...form, photo: e.target.files[0] });
  };

  // Validação
  const validateForm = () => {
    const errors = { numeroPatrimonio: '', photo: '' };
    let isValid = true;

    if (!form.numeroPatrimonio.trim()) {
      errors.numeroPatrimonio = 'O número do patrimônio é obrigatório.';
      isValid = false;
    }
    if (!form.photo) {
      errors.photo = 'A foto é obrigatória.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  }

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!activeSessionId) {
      setError('Não há sessão de conferência ativa para registrar o item.');
      return;
    }
    const token = localStorage.getItem('token');
    
    const userIdFromToken = decodeToken(token)?.userId;
    if (!userIdFromToken) {
      setError('ID do usuário não encontrado. Faça login novamente.');
      return;
    }
    
    const formData = new FormData();
    formData.append('sessaoId', activeSessionId);
    formData.append('localEncontradoId', localId);
    formData.append('numeroPatrimonio', form.numeroPatrimonio);
    formData.append('placaIdentificacaoOk', form.placaIdentificacaoOk);
    formData.append('observacao', form.observacao == '' ? 'Sem observações' : form.observacao);
    formData.append('conferidoPorId', userIdFromToken);
    formData.append('foto', form.photo);

    try {
      setSubmitting(true); 
      const response = await fetch(`${API_URL}/ItensConferidos`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error('Falha ao registrar item.');
      
      alert('Item registrado com sucesso!');
      setConferidos(prev => [...prev, form.numeroPatrimonio]);
      setForm({ numeroPatrimonio: '', placaIdentificacaoOk: !isManualEntry, observacao: '', photo: null });
      setPatrimonioInfo(null);
      setFormErrors({ numeroPatrimonio: '', photo: '' });
      setIsFormOpen(!isFormOpen);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    } 
  };

  // Loading ou erro
  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Conferência de Patrimônio</h2>
      <p>Local: Sala {localId}</p>

      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        {isFormOpen ? 'Fechar Formulário' : 'Abrir Formulário de Conferência'}
      </button>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-bold mb-4">Item a ser Conferido</h3>

          {/* Nº Patrimônio */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nº Patrimônio</label>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={form.numeroPatrimonio}
                onChange={handleManualChange}
                placeholder="Digite o código"
                className={`w-full px-3 py-2 border rounded-lg ${formErrors.numeroPatrimonio ? 'border-red-500' : 'border-gray-300'}`}
                disabled={!isManualEntry}
              />
              <button
                type="button"
                onClick={toggleEntryMode}
                className="bg-gray-200 px-4 rounded-lg hover:bg-gray-300"
              >
                {isManualEntry ? 'Usar Câmera' : 'Entrada Manual'}
              </button>
            </div>
            {formErrors.numeroPatrimonio && <p className="text-red-500 text-sm mt-1">{formErrors.numeroPatrimonio}</p>}
            
            {/* Exibir resultado da consulta */}
            {erroConsulta && <p className="text-red-600 mb-4">{erroConsulta}</p>}
            {patrimonioInfo && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
                <h3 className="text-md font-bold">
                  Patrimônio {patrimonioInfo.numeroPatrimonio}
                </h3>
                <p className="text-sm text-gray-700">{patrimonioInfo.descricaoEquipamento}</p>
                <p className="text-xs text-gray-500">
                  Local Atual: <strong>{patrimonioInfo.localNome}</strong>
                </p>
              </div>
            )}

            {!isManualEntry && (
              <>
                <CameraQR
                  form={form}
                  setForm={setForm}
                  isManualEntry={isManualEntry}
                  zoomLevel={zoomLevel}
                />

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Zoom da Câmera</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={zoomLevel}
                      onChange={e => setZoomLevel(parseFloat(e.target.value))}
                      className="flex-1 h-2 rounded-lg bg-gray-200 accent-blue-500"
                    />
                    <span className="text-sm w-8 text-right">{zoomLevel.toFixed(1)}x</span>
                  </div>
                </div>
              </>
            )}
            
          

          </div>

          
          {/* Foto */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Foto do Bem</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className={`w-full ${formErrors.photo ? 'border-red-500' : ''}`}
            />
            {formErrors.photo && <p className="text-red-500 text-sm mt-1">{formErrors.photo}</p>}
          </div>

          {/* Placa Identificação */}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={form.placaIdentificacaoOk}
                readOnly
                className="form-checkbox"
              />
              <span className="ml-2 text-gray-700">Placa de identificação OK</span>
            </label>
          </div>

          {/* Observação */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Observação</label>
            <textarea
              value={form.observacao}
              onChange={(e) => setForm({...form, observacao: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
            />
          </div>

          <button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              disabled={submitting}  // Desabilita enquanto envia
            >
              {submitting ? 'Registrando...' : 'Registrar Item'}
            </button>
        </form>
      )}

      {/* Lista de Patrimônios Esperados */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
         <button
            onClick={toggleOpen}
            className="flex justify-between items-center w-full focus:outline-none"
          >
            <h3 className="text-lg font-bold mb-4">
              Itens Esperados nesta Sala ({patrimonios.length})
            </h3>            
            <span className="text-gray-500 hover:text-gray-700">
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </span>

          </button>
        
        <div 
        className={`grid gap-3 sm:grid-cols-2 mt-4 
          ${isOpen 
            ? 'max-h opacity-100'
            : 'max-h-0 opacity-0'
          } 
          overflow-hidden transition-all duration-500 ease-in-out`}
        >
          {patrimonios.map((patrimonio) => {
            const isConferido = conferidos.some(item => item.numeroPatrimonio === patrimonio.numeroPatrimonio && item.status === 'encontrado');
            const isJustificado = conferidos.some(item => item.numeroPatrimonio === patrimonio.numeroPatrimonio && item.status === 'justificado');                        
                  
            return (
              <div
                key={patrimonio.id}
                className={`p-4 rounded-xl border shadow-sm flex flex-col 
                  ${isConferido                     
                    ? 'bg-green-50 border-green-400 text-green-800' 
                    : isJustificado
                    ? 'bg-blue-50 border-blue-400 text-blue-800' 
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                  }                  
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{patrimonio.numeroPatrimonio}</span>
                  {isConferido ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-200 text-green-800 rounded-full">
                      ✔ Conferido
                    </span>
                  ) : (
                    isJustificado ? (
                      <span className="px-2 py-1 text-xs font-semibold bg-blue-200 text-blue-800 rounded-full">
                        ✔ Justificado
                      </span>                  
                  ) : (
                    <>
                      <span className="px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-600 rounded-full">
                        ❌ Pendente
                      </span>                  
                      <button
                        onClick={() => openJustifyModal(patrimonio)}
                        className="px-2 py-1 text-xs font-semibold bg-blue-200 text-gray-600 rounded-full hover:bg-gray-300"
                        >
                        ℹ️ Justificar
                      </button>
                    </>
                  ))}
                </div>
                <p className="mt-1 text-sm">{patrimonio.descricaoEquipamento}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Justificativa */}
      {isJustifyModalOpen && (
        <JustifyModal 
          isOpen={isJustifyModalOpen}
          onClose={() => setIsJustifyModalOpen(false)}
          onSubmit={handleJustifySubmit}
          item={itemToJustify}
        />
      )}

      {/* Lista de Inconsistências */}
      <div className="bg-red-50 p-6 rounded-lg shadow-md mt-6">
         <button
            onClick={toggleOpenFora}
            className="flex justify-between items-center w-full focus:outline-none"
          >
            <h3 className="text-lg font-bold mb-4 text-red-700">
              Itens fora desta Sala ({inconsistencias.length})
            </h3>            
            <span className="text-gray-500 hover:text-gray-700">
              {isOpenFora ? <ChevronUp /> : <ChevronDown />}
            </span>

          </button>
        
        <div 
        className={`grid gap-3 sm:grid-cols-2 mt-4 
          ${isOpenFora 
            ? 'max-h opacity-100'
            : 'max-h-0 opacity-0'
          } 
          overflow-hidden transition-all duration-500 ease-in-out`}
        >

          {inconsistencias.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-red-400 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-red-600">{item.numeroPatrimonio}</span>
                <span className="px-2 py-1 text-xs font-semibold bg-red-200 text-red-800 rounded-full">
                  ⚠ Inconsistência
                </span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-600">{item.patrimonioNome}</span>                
              </div>
              <p className="mt-1 text-sm text-gray-700">
                Local Esperado: <span className="font-semibold">{item.localEsperado}</span>
              </p>
            </div>
          ))}
        </div>
      </div>  

      {/* Meu Item encontrado em outro lugar */}
      <div className="bg-yellow-50 p-6 rounded-lg shadow-md mt-6">
         <button
            onClick={toggleOpenLocal}
            className="flex justify-between items-center w-full focus:outline-none"
          >
            <h3 className="text-lg font-bold mb-4 text-yellow-700">
              Itens em outro Local ({inconsistencias_meu_local.length})
            </h3>            
            <span className="text-gray-500 hover:text-gray-700">
              {isOpenFora ? <ChevronUp /> : <ChevronDown />}
            </span>

          </button>
        
        <div 
        className={`grid gap-3 sm:grid-cols-2 mt-4 
          ${isOpenLocal
            ? 'max-h opacity-100'
            : 'max-h-0 opacity-0'
          } 
          overflow-hidden transition-all duration-500 ease-in-out`}
        >
     
          {inconsistencias_meu_local.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-yellow-400 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-yellow-600">{item.numeroPatrimonio}</span>                
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-600">{item.patrimonioNome}</span>                
              </div>
              <p className="mt-1 text-sm text-gray-700">
                Local Encontrado: <span className="font-semibold">{item.localEncontrado}</span>
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Encontrado Por: <span className="font-semibold">{item.conferidoPorNome}</span>
              </p>
            </div>
          ))}
        </div>
      </div>      
    </div>
  );
}

export default Inventory;
