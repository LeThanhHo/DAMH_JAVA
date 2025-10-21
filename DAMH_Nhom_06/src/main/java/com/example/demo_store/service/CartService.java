package com.example.demo_store.service;

import com.example.demo_store.entity.Cart;
import com.example.demo_store.entity.User;

public interface CartService {
    Cart getCartByUser(User user);
    Cart addItemToCart(User user, Long productId, int quantity);
    void removeItemFromCart(Long cartItemId);
    void clearCart(User user);
}
