package com.example.demo_store.service;

import com.example.demo_store.dto.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO dto);
    OrderDTO updateOrder(Long id, OrderDTO dto);
    void deleteOrder(Long id);
    OrderDTO getOrderById(Long id);
    List<OrderDTO> getAllOrders();
}