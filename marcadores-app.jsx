import React, { useState } from 'react';
import { Plus, X, ChevronDown, Trash2 } from 'lucide-react';

export default function MarcadoresApp() {
  const [marcadores, setMarcadores] = useState([]);
  const [dados, setDados] = useState([
    { id: 241, cliente: "VALMIR RODRIGUES DE LIMA", contato: "(61) 9 9135-8355", valor: "R$ 4.671,60", status: "Contrato Ativo", marcadoresAssignados: [] },
    { id: 240, cliente: "ANDRE SASSEN PANERAI", contato: "(31) 9 8494-0020", valor: "R$ 425,00", status: "Contrato Ativo", marcadoresAssignados: [] },
  ]);
  
  const [showNewMarcador, setShowNewMarcador] = useState(false);
  const [novoMarcador, setNovoMarcador] = useState({ cor: '#FF0000', titulo: '', descricao: '' });
  const [filtrosMarcadores, setFiltrosMarcadores] = useState([]);
  const [itemEditando, setItemEditando] = useState(null);
  const [showMarcadoresDropdown, setShowMarcadoresDropdown] = useState({});

  const cores = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A'];

  // Criar novo marcador
  const criarMarcador = () => {
    if (novoMarcador.titulo.trim()) {
      const novoId = Date.now();
      setMarcadores([...marcadores, { id: novoId, ...novoMarcador }]);
      setNovoMarcador({ cor: '#FF0000', titulo: '', descricao: '' });
      setShowNewMarcador(false);
    }
  };

  // Deletar marcador
  const deletarMarcador = (id) => {
    setMarcadores(marcadores.filter(m => m.id !== id));
    setDados(dados.map(d => ({
      ...d,
      marcadoresAssignados: d.marcadoresAssignados.filter(mId => mId !== id)
    })));
  };

  // Adicionar marcador a um item
  const adicionarMarcadorAoItem = (itemId, marcadorId) => {
    setDados(dados.map(d => {
      if (d.id === itemId && !d.marcadoresAssignados.includes(marcadorId)) {
        return { ...d, marcadoresAssignados: [...d.marcadoresAssignados, marcadorId] };
      }
      return d;
    }));
  };

  // Remover marcador de um item
  const removerMarcadorDoItem = (itemId, marcadorId) => {
    setDados(dados.map(d => {
      if (d.id === itemId) {
        return { ...d, marcadoresAssignados: d.marcadoresAssignados.filter(mId => mId !== marcadorId) };
      }
      return d;
    }));
  };

  // Toggle filtro de marcador
  const toggleFiltro = (marcadorId) => {
    if (filtrosMarcadores.includes(marcadorId)) {
      setFiltrosMarcadores(filtrosMarcadores.filter(m => m !== marcadorId));
    } else {
      setFiltrosMarcadores([...filtrosMarcadores, marcadorId]);
    }
  };

  // Filtrar dados
  const dadosFiltrados = filtrosMarcadores.length === 0 
    ? dados 
    : dados.filter(d => filtrosMarcadores.some(f => d.marcadoresAssignados.includes(f)));

  // Get marcador by ID
  const getMarcador = (id) => marcadores.find(m => m.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Gerenciador de Marcadores</h1>
          <p className="text-slate-300">Crie marcadores, associe a itens e filtre sua planilha</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Painel de Marcadores */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">🏷️ Marcadores</h2>
                <button
                  onClick={() => setShowNewMarcador(!showNewMarcador)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                >
                  <Plus size={20} className="text-blue-400" />
                </button>
              </div>

              {/* Novo Marcador */}
              {showNewMarcador && (
                <div className="mb-4 p-4 bg-slate-700 rounded-lg">
                  <div className="mb-3">
                    <label className="block text-sm text-slate-300 mb-1">Título</label>
                    <input
                      type="text"
                      value={novoMarcador.titulo}
                      onChange={(e) => setNovoMarcador({ ...novoMarcador, titulo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-400 focus:outline-none"
                      placeholder="Ex: Urgente"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-slate-300 mb-1">Descrição</label>
                    <textarea
                      value={novoMarcador.descricao}
                      onChange={(e) => setNovoMarcador({ ...novoMarcador, descricao: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-400 focus:outline-none text-sm"
                      placeholder="Descrição do marcador..."
                      rows="2"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-slate-300 mb-2">Cor</label>
                    <div className="grid grid-cols-5 gap-2">
                      {cores.map(cor => (
                        <button
                          key={cor}
                          onClick={() => setNovoMarcador({ ...novoMarcador, cor })}
                          className={`w-8 h-8 rounded border-2 transition ${
                            novoMarcador.cor === cor ? 'border-white' : 'border-slate-600'
                          }`}
                          style={{ backgroundColor: cor }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={criarMarcador}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition font-medium"
                  >
                    Criar Marcador
                  </button>
                </div>
              )}

              {/* Lista de Marcadores */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {marcadores.length === 0 ? (
                  <p className="text-slate-400 text-sm">Nenhum marcador criado</p>
                ) : (
                  marcadores.map(marc => (
                    <div key={marc.id} className="p-3 bg-slate-700 rounded hover:bg-slate-600 transition group">
                      <div className="flex items-start gap-2">
                        <div
                          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: marc.cor }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{marc.titulo}</p>
                          {marc.descricao && (
                            <p className="text-slate-400 text-xs mt-1 line-clamp-2">{marc.descricao}</p>
                          )}
                        </div>
                        <button
                          onClick={() => deletarMarcador(marc.id)}
                          className="p-1 opacity-0 group-hover:opacity-100 transition hover:bg-red-600 rounded"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Filtros */}
              {marcadores.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-600">
                  <h3 className="text-sm font-bold text-white mb-3">Filtrar por:</h3>
                  <div className="space-y-2">
                    {marcadores.map(marc => (
                      <label key={marc.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-700 p-2 rounded transition">
                        <input
                          type="checkbox"
                          checked={filtrosMarcadores.includes(marc.id)}
                          onChange={() => toggleFiltro(marc.id)}
                          className="w-4 h-4"
                        />
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: marc.cor }}
                        />
                        <span className="text-sm text-slate-300">{marc.titulo}</span>
                      </label>
                    ))}
                  </div>
                  {filtrosMarcadores.length > 0 && (
                    <button
                      onClick={() => setFiltrosMarcadores([])}
                      className="w-full mt-3 text-sm text-slate-400 hover:text-slate-200 transition"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tabela de Dados */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 rounded-lg overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700 border-b border-slate-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Cliente</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Contato</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Valor</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-white">Marcadores</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {dadosFiltrados.map(item => (
                      <tr key={item.id} className="hover:bg-slate-700 transition">
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{item.cliente}</p>
                          <p className="text-slate-400 text-sm">ID: {item.id}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-300 text-sm">{item.contato}</td>
                        <td className="px-6 py-4 text-white font-medium">{item.valor}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-900 text-green-200 text-sm rounded-full">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <div className="flex flex-wrap gap-2 justify-center">
                              {item.marcadoresAssignados.map(marcId => {
                                const marc = getMarcador(marcId);
                                return marc ? (
                                  <div
                                    key={marcId}
                                    title={`${marc.titulo}\n${marc.descricao}`}
                                    className="w-6 h-6 rounded-full cursor-pointer hover:ring-2 hover:ring-white transition"
                                    style={{ backgroundColor: marc.cor }}
                                  />
                                ) : null;
                              })}
                              <button
                                onClick={() => setItemEditando(item.editando === item.id ? null : item.id)}
                                className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Dropdown de Marcadores */}
                            {itemEditando === item.id && marcadores.length > 0 && (
                              <div className="absolute top-10 right-0 bg-slate-700 rounded-lg shadow-lg z-10 p-2 min-w-48">
                                <p className="text-xs text-slate-400 px-2 py-1 font-bold">Adicionar:</p>
                                {marcadores.map(marc => (
                                  <button
                                    key={marc.id}
                                    onClick={() => {
                                      adicionarMarcadorAoItem(item.id, marc.id);
                                      setItemEditando(null);
                                    }}
                                    disabled={item.marcadoresAssignados.includes(marc.id)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded transition flex items-center gap-2 ${
                                      item.marcadoresAssignados.includes(marc.id)
                                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                        : 'hover:bg-slate-600 text-white'
                                    }`}
                                  >
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: marc.cor }}
                                    />
                                    {marc.titulo}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Remover Marcadores */}
                            {item.marcadoresAssignados.length > 0 && (
                              <div className="absolute -top-8 right-0 flex gap-1 bg-slate-700 rounded p-1 opacity-0 hover:opacity-100 transition">
                                {item.marcadoresAssignados.map(marcId => {
                                  const marc = getMarcador(marcId);
                                  return marc ? (
                                    <button
                                      key={marcId}
                                      onClick={() => removerMarcadorDoItem(item.id, marcId)}
                                      className="relative group"
                                    >
                                      <X
                                        size={14}
                                        className="text-red-400 hover:text-red-300"
                                      />
                                    </button>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {dadosFiltrados.length === 0 && marcadores.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400">Nenhum item corresponde aos filtros selecionados</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-4 text-slate-400 text-sm">
              <p>📌 Mostrando {dadosFiltrados.length} de {dados.length} itens</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
