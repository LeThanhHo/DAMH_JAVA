package com.example.demo_store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String customerName;
    private String shippingAddress;
    private String quantity;
    private LocalDateTime orderDate;
    private List<OrderItemDTO> items;
}
