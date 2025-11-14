package com.example.Bike_store.service.impl;

import org.springframework.stereotype.Service;

import com.example.Bike_store.dto.OrderDTO;
import com.example.Bike_store.entity.Order;
import com.example.Bike_store.entity.OrderItem;
import com.example.Bike_store.entity.Product;
import com.example.Bike_store.mapper.OrderMapper;
import com.example.Bike_store.repository.OrderRepository;
import com.example.Bike_store.repository.ProductRepository;
import com.example.Bike_store.service.OrderService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    public OrderServiceImpl(OrderRepository orderRepository, ProductRepository productRepository, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.orderMapper = orderMapper;
    }

    @Override
    public OrderDTO createOrder(OrderDTO dto) {
        // Nếu frontend không truyền ngày -> tự động set thời điểm hiện tại
        if (dto.getOrderDate() == null) {
            dto.setOrderDate(java.time.LocalDateTime.now());
        }
        return orderMapper.toDTO(orderRepository.save(orderMapper.toEntity(dto)));
    }

    @Override
    public OrderDTO updateOrder(Long id, OrderDTO dto) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setCustomerName(dto.getCustomerName());
        order.setShippingAddress(dto.getShippingAddress());
        order.setOrderDate(dto.getOrderDate() != null ? dto.getOrderDate() : java.time.LocalDateTime.now());

        // Xóa item cũ và thêm item mới
        order.getItems().clear();

        List<OrderItem> updatedItems = dto.getItems().stream().map(itemDto -> {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemDto.getQuantity());
            item.setPrice(product.getPriceProduct());
            item.setOrder(order);
            return item;
        }).collect(Collectors.toList());

        order.getItems().addAll(updatedItems);

        return orderMapper.toDTO(orderRepository.save(order));
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    @Override
    public OrderDTO getOrderById(Long id) {
        return orderMapper.toDTO(orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found")));
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ✅ Thêm mới: tính tổng doanh thu
    @Override
    public double getTotalRevenue() {
        return orderRepository.findAll()
                .stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();
    }
}
