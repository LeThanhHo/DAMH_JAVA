package com.example.Bike_store.service;

import java.util.List;
import com.example.Bike_store.dto.ProductDTO;

public interface ProductService {
    ProductDTO createProduct(ProductDTO dto);
    ProductDTO updateProduct(Long id, ProductDTO dto);
    void deleteProduct(Long id);
    ProductDTO getProductById(Long id);
    List<ProductDTO> getAllProducts();

    // --- Thêm 2 chức năng ---
    List<ProductDTO> getProductsNewest(int limit);
}
