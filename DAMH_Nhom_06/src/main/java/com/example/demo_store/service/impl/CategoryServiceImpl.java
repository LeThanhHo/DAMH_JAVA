package com.example.demo_store.service.impl;

import com.example.demo_store.dto.CategoryDTO;
import com.example.demo_store.entity.Category;
import com.example.demo_store.mapper.CategoryMapper;
import com.example.demo_store.repository.CategoryRepository;
import com.example.demo_store.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryRepository repo, CategoryMapper mapper) {
        this.categoryRepository = repo;
        this.categoryMapper = mapper;
    }

    @Override
    public CategoryDTO create(CategoryDTO dto) {
        return categoryMapper.toDTO(categoryRepository.save(categoryMapper.toEntity(dto)));
    }

    @Override
    public CategoryDTO update(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        return categoryMapper.toDTO(categoryRepository.save(category));
    }

    @Override
    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public CategoryDTO getById(Long id) {
        return categoryMapper.toDTO(categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found")));
    }

    @Override
    public List<CategoryDTO> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }
}
