package com.example.demo_store.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameProduct;
    private String descriptionProduct;
    private Double priceProduct;

    // Các thuộc tính tùy chọn
    private String brand;
    private int quantity;

    //nhiều ảnh
    //private List<ProductImage> images;

    // Đường dẫn hoặc tên ảnh sản phẩm
    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private List<OrderItem> orderItems;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}

