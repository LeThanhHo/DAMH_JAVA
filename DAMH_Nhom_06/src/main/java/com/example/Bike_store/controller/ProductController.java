package com.example.Bike_store.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Bike_store.dto.ProductDTO;
import com.example.Bike_store.entity.Product;
import com.example.Bike_store.repository.OrderRepository;
import com.example.Bike_store.service.ProductService;

import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    //thêm sản phẩm
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }
    //sửa sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }
    //xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    //lấy sản phẩm theo id với HATEOAS
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        ProductDTO dto = productService.getProductById(id);

        // Thêm link điều hướng
        dto.add(linkTo(methodOn(ProductController.class).getProduct(id)).withSelfRel());
        dto.add(linkTo(methodOn(ProductController.class).getAllProducts()).withRel("all-products"));
        dto.add(linkTo(methodOn(ProductController.class).deleteProduct(id)).withRel("delete"));
        dto.add(linkTo(methodOn(ProductController.class).updateProduct(id, dto)).withRel("update"));

        return ResponseEntity.ok(dto);
    }
    //lấy tất cả sản phẩm
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
@GetMapping("/api/products/newest")
public List<ProductDTO> getProductsNewest(@RequestParam(defaultValue = "5") int limit) {
    return productService.getProductsNewest(limit);
}

}

