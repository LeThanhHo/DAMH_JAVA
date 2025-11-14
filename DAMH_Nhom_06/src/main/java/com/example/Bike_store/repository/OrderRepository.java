package com.example.Bike_store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Bike_store.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

}
