package com.example.Bike_store.mapper;

import org.springframework.stereotype.Component;

import com.example.Bike_store.dto.CartItemDTO;
import com.example.Bike_store.entity.Cart;
import com.example.Bike_store.entity.CartItem;
import com.example.Bike_store.entity.Product;

@Component
public class CartItemMapper {

    public CartItemDTO toDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getNameProduct());
        dto.setQuantity(item.getQuantity());
        dto.setPricePerItem(item.getProduct().getPriceProduct());
        return dto;
    }

    public CartItem toEntity(CartItemDTO dto, Product product, Cart cart) {
        CartItem item = new CartItem();
        item.setId(dto.getId());
        item.setProduct(product);
        item.setCart(cart);
        item.setQuantity(dto.getQuantity());
        return item;
    }
}
