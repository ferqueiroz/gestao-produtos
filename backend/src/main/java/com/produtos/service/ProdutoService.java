package com.produtos.service;

import com.produtos.dto.ProdutoDTO;
import com.produtos.entity.Produto;
import com.produtos.repository.ProdutoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    public Page<ProdutoDTO> listar(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        return repository.findAll(pageable).map(this::toDTO);
    }

    public ProdutoDTO buscarPorId(Long id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    public ProdutoDTO criar(ProdutoDTO dto) {
        Produto produto = new Produto(dto.getDescricao(), dto.getPreco());
        return toDTO(repository.save(produto));
    }

    public ProdutoDTO atualizar(Long id, ProdutoDTO dto) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        return toDTO(repository.save(produto));
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado");
        }
        repository.deleteById(id);
    }

    private ProdutoDTO toDTO(Produto p) {
        return new ProdutoDTO(p.getId(), p.getDescricao(), p.getPreco());
    }
}
