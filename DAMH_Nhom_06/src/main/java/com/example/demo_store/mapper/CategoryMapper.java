package com.example.demo_store.mapper;

import com.example.demo_store.dto.CategoryDTO;
import com.example.demo_store.entity.Product;
import com.example.demo_store.entity.Category;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CategoryMapper {

    public  CategoryDTO toDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        if (category.getProducts() != null) {
            dto.setProductIds(
                    category.getProducts().stream()
                            .map(Product::getId)
                            .collect(Collectors.toList()));
        }

        return dto;
    }

    public Category toEntity(CategoryDTO dto) {
        Category category = new Category();
        category.setId(dto.getId());
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        // Không gán productIds vào đây
        return category;
    }
}