package com.example.demo_store.controller;

import com.example.demo_store.dto.ProductDTO;
import com.example.demo_store.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

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

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
}

