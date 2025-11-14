package com.example.Bike_store.service;

import com.example.Bike_store.dto.CartDTO;
import com.example.Bike_store.entity.Cart;
import com.example.Bike_store.entity.User;

public interface CartService {
    Cart getCartByUser(User user);

    Cart addItemToCart(User user, Long productId, int quantity);

    void removeItemFromCart(User user, Long cartItemId);

    void clearCart(User user);

    CartDTO updateCartItem(Long cartItemId, int quantity);

    Cart updateCartItemQuantity(User user, Long cartItemId, int quantity);

}
