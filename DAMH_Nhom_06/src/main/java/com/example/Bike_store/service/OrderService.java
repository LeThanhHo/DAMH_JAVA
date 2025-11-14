package com.example.Bike_store.service;

import java.util.List;
import com.example.Bike_store.dto.OrderDTO;

public interface OrderService {
    OrderDTO createOrder(OrderDTO dto);
    OrderDTO updateOrder(Long id, OrderDTO dto);
    void deleteOrder(Long id);
    OrderDTO getOrderById(Long id);
    List<OrderDTO> getAllOrders();
    double getTotalRevenue();


}
