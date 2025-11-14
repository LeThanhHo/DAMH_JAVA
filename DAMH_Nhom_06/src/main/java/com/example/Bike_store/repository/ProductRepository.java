package com.example.Bike_store.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Bike_store.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // --- Sản phẩm mới nhất ---
    List<Product> findAllByOrderByCreatedAtDesc(Pageable pageable);

}
