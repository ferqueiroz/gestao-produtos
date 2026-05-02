import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/produtos";

const formatarPreco = (preco) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(preco);

function Modal({ produto, onSalvar, onFechar }) {
  const [descricao, setDescricao] = useState(produto?.descricao || "");
  const [preco, setPreco] = useState(produto?.preco || "");
  const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!descricao.trim()) return setErro("Descrição é obrigatória.");
    if (!preco || isNaN(preco) || Number(preco) <= 0) return setErro("Preço deve ser um número positivo.");
    setErro("");
    onSalvar({ descricao: descricao.trim(), preco: parseFloat(preco) });
  };

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{produto ? "Editar Produto" : "Novo Produto"}</h2>
          <button className="btn-fechar" onClick={onFechar}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {erro && <div className="erro-msg">{erro}</div>}
          <div className="campo">
            <label>Descrição</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Notebook Dell Inspiron"
              autoFocus
            />
          </div>
          <div className="campo">
            <label>Preço (R$)</label>
            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="Ex: 1299.90"
              step="0.01"
              min="0"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-cancelar" onClick={onFechar}>Cancelar</button>
            <button type="submit" className="btn btn-salvar">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDialog({ mensagem, onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
        <p>{mensagem}</p>
        <div className="modal-actions">
          <button className="btn btn-cancelar" onClick={onCancelar}>Cancelar</button>
          <button className="btn btn-deletar" onClick={onConfirmar}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalItens, setTotalItens] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const carregar = useCallback(async (pg = 0) => {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch(`${API_URL}?page=${pg}&size=15`);
      if (!res.ok) throw new Error("Erro ao buscar produtos");
      const data = await res.json();
      setProdutos(data.content);
      setTotalPaginas(data.totalPages);
      setTotalItens(data.totalElements);
      setPagina(pg);
    } catch (e) {
      setErro("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(0); }, [carregar]);

  const salvar = async (dados) => {
    try {
      const method = produtoEditando ? "PUT" : "POST";
      const url = produtoEditando ? `${API_URL}/${produtoEditando.id}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error();
      fecharModal();
      carregar(pagina);
    } catch {
      setErro("Erro ao salvar produto.");
    }
  };

  const deletar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setConfirmDelete(null);
      carregar(pagina);
    } catch {
      setErro("Erro ao excluir produto.");
    }
  };

  const abrirCriar = () => { setProdutoEditando(null); setModalAberto(true); };
  const abrirEditar = (p) => { setProdutoEditando(p); setModalAberto(true); };
  const fecharModal = () => { setModalAberto(false); setProdutoEditando(null); };

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <span className="header-icon">📦</span>
            <div>
              <h1>Gestão de Produtos</h1>
              <p className="header-sub">Sistema de controle de estoque</p>
            </div>
          </div>
          <button className="btn btn-novo" onClick={abrirCriar}>+ Novo Produto</button>
        </div>
      </header>

      <main className="main">
        {erro && (
          <div className="alerta-erro">
            ⚠️ {erro}
            <button onClick={() => setErro("")}>✕</button>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <span className="total-badge">{totalItens} produto{totalItens !== 1 ? "s" : ""}</span>
            {carregando && <span className="carregando">Carregando...</span>}
          </div>

          {carregando && produtos.length === 0 ? (
            <div className="vazio">Carregando produtos...</div>
          ) : produtos.length === 0 ? (
            <div className="vazio">
              <span>📭</span>
              <p>Nenhum produto cadastrado ainda.</p>
              <button className="btn btn-novo" onClick={abrirCriar}>Cadastrar primeiro produto</button>
            </div>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela">
                <thead>
                  <tr>
                    <th className="col-id">#</th>
                    <th>Descrição</th>
                    <th className="col-preco">Preço</th>
                    <th className="col-acoes">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((p, i) => (
                    <tr key={p.id} className={i % 2 === 0 ? "row-par" : "row-impar"}>
                      <td className="col-id">{p.id}</td>
                      <td className="col-descricao">{p.descricao}</td>
                      <td className="col-preco preco-valor">{formatarPreco(p.preco)}</td>
                      <td className="col-acoes">
                        <button
                          className="btn-acao btn-editar"
                          onClick={() => abrirEditar(p)}
                          title="Editar"
                        >✏️</button>
                        <button
                          className="btn-acao btn-excluir"
                          onClick={() => setConfirmDelete(p)}
                          title="Excluir"
                        >🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPaginas > 1 && (
            <div className="paginacao">
              <button
                className="btn-pag"
                onClick={() => carregar(pagina - 1)}
                disabled={pagina === 0}
              >← Anterior</button>

              <div className="paginas-numeros">
                {paginas.map((i) => (
                  <button
                    key={i}
                    className={`btn-pag-num ${i === pagina ? "ativo" : ""}`}
                    onClick={() => carregar(i)}
                  >{i + 1}</button>
                ))}
              </div>

              <button
                className="btn-pag"
                onClick={() => carregar(pagina + 1)}
                disabled={pagina >= totalPaginas - 1}
              >Próxima →</button>
            </div>
          )}
        </div>
      </main>

      {modalAberto && (
        <Modal
          produto={produtoEditando}
          onSalvar={salvar}
          onFechar={fecharModal}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          mensagem={`Deseja excluir "${confirmDelete.descricao}"?`}
          onConfirmar={() => deletar(confirmDelete.id)}
          onCancelar={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
