package com.example.demo_store.mapper;

import com.example.demo_store.dto.ProductDTO;
import com.example.demo_store.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProductMapper {
    private final CategoryMapper categoryMapper;

    @Autowired
    public ProductMapper(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public Product toEntity(ProductDTO dto) {
        Product product = new Product();
        product.setId(dto.getId());
        product.setNameProduct(dto.getNameProduct());
        product.setDescriptionProduct(dto.getDescriptionProduct());
        product.setPriceProduct(dto.getPriceProduct());
        product.setBrand(dto.getBrand());
        product.setQuantity(dto.getQuantity());
        product.setImageUrl(dto.getImageUrl());

        if (dto.getCategory() != null) {
            product.setCategory(categoryMapper.toEntity(dto.getCategory()));
        }

        return product;
    }

    public ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setNameProduct(product.getNameProduct());
        dto.setDescriptionProduct(product.getDescriptionProduct());
        dto.setPriceProduct(product.getPriceProduct());
        dto.setBrand(product.getBrand());
        dto.setQuantity(product.getQuantity());
        dto.setImageUrl(product.getImageUrl());

        if (product.getOrderItems() != null) {
            dto.setOrderIds(product.getOrderItems().stream()
                    .map(orderItem -> orderItem.getOrder().getId())
                    .collect(Collectors.toList()));
        }

        if (product.getCategory() != null) {
            dto.setCategory(categoryMapper.toDTO(product.getCategory()));
        }

        return dto;
    }
}

