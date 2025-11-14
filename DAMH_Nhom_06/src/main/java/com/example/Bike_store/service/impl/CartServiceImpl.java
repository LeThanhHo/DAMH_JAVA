package com.example.Bike_store.service.impl;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.example.Bike_store.dto.CartDTO;
import com.example.Bike_store.entity.Cart;
import com.example.Bike_store.entity.CartItem;
import com.example.Bike_store.entity.Product;
import com.example.Bike_store.entity.User;
import com.example.Bike_store.repository.CartItemRepository;
import com.example.Bike_store.repository.CartRepository;
import com.example.Bike_store.repository.ProductRepository;
import com.example.Bike_store.service.CartService;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    public CartServiceImpl(CartRepository cartRepository, ProductRepository productRepository,
            CartItemRepository cartItemRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public Cart getCartByUser(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    @Override
    public Cart addItemToCart(User user, Long productId, int quantity) {
        Cart cart = getCartByUser(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Nếu đã có → cộng dồn số lượng
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            // Nếu chưa có → tạo item mới
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Override
    public void removeItemFromCart(User user, Long cartItemId) {
        Cart cart = getCartByUser(user);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cartRepository.save(cart);
    }

    @Override
    public void clearCart(User user) {
        Cart cart = getCartByUser(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Override
    public CartDTO updateCartItem(Long cartItemId, int quantity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateCartItem'");
    }

    @Override
    public Cart updateCartItemQuantity(User user, Long cartItemId, int quantity) {
        // Lấy giỏ hàng của user
        Cart cart = getCartByUser(user);

        // Tìm item theo cartItemId
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            // Nếu quantity <= 0 → xóa item khỏi giỏ
            cart.getItems().remove(item);
            cartItemRepository.delete(item); // xóa luôn ở DB
        } else {
            // Cập nhật số lượng
            item.setQuantity(quantity);
        }

        // Lưu lại cart
        return cartRepository.save(cart);
    }

}
