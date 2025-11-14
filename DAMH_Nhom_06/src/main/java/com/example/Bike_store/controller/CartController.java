package com.example.Bike_store.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.Bike_store.entity.Cart;
import com.example.Bike_store.entity.User;
import com.example.Bike_store.repository.UserRepository;
import com.example.Bike_store.service.CartService;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("isAuthenticated()") // Tất cả API trong controller yêu cầu login
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    // Lấy giỏ hàng hiện tại
    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        Cart cart = cartService.getCartByUser(user);
        return ResponseEntity.ok(cart);
    }

    // Thêm sản phẩm vào giỏ
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long productId,
            @RequestParam int quantity) {

        User user = getUser(userDetails);
        Cart cart = cartService.addItemToCart(user, productId, quantity);
        return ResponseEntity.ok(cart);
    }

    // Cập nhật số lượng sản phẩm trong giỏ
    @PutMapping("/update")
    public ResponseEntity<Cart> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long cartItemId,
            @RequestParam int quantity) {

        User user = getUser(userDetails);
        Cart updatedCart = cartService.updateCartItemQuantity(user, cartItemId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    // Xóa sản phẩm khỏi giỏ
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Void> removeItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId) {

        User user = getUser(userDetails);
        cartService.removeItemFromCart(user, cartItemId);
        return ResponseEntity.noContent().build();
    }

    // Xóa toàn bộ giỏ hàng
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }

    // Helper: lấy user từ UserDetails
    private User getUser(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
