package com.example.Bike_store.mapper;

import org.springframework.stereotype.Component;

import com.example.Bike_store.dto.OrderDTO;
import com.example.Bike_store.dto.OrderItemDTO;
import com.example.Bike_store.entity.Order;
import com.example.Bike_store.entity.OrderItem;
import com.example.Bike_store.entity.Product;
import com.example.Bike_store.repository.ProductRepository;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    private final ProductRepository productRepository;

    public OrderMapper(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Order toEntity(OrderDTO dto) {
        Order order = new Order();
        order.setId(dto.getId());
        order.setCustomerName(dto.getCustomerName());
        order.setShippingAddress(dto.getShippingAddress());
        order.setOrderDate(dto.getOrderDate());
        order.setQuantity(dto.getQuantity());
        List<OrderItem> items = dto.getItems().stream().map(itemDto -> {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemDto.getQuantity());
            item.setPrice(product.getPriceProduct());
            item.setOrder(order);
            return item;
        }).collect(Collectors.toList());

        order.setItems(items);
        return order;
    }

    public OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setCustomerName(order.getCustomerName());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setOrderDate(order.getOrderDate());
        dto.setQuantity(order.getQuantity());
        dto.setItems(
                order.getItems().stream().map(item -> new OrderItemDTO(item.getProduct().getId(), item.getQuantity(),item.getPrice()))
                        .collect(Collectors.toList()));
 dto.setTotalAmount(order.getTotalAmount());
        return dto;
    }
}
