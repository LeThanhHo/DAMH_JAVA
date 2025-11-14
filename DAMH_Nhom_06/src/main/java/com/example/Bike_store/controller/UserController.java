package com.example.Bike_store.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.Bike_store.dto.UserDTO;
import com.example.Bike_store.dto.UserRegisterRequest;
import com.example.Bike_store.entity.Role;
import com.example.Bike_store.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    //đăng ký admin
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register-admin")
    public ResponseEntity<UserDTO> registerAdmin(@RequestBody UserRegisterRequest request) {
        UserDTO dto = new UserDTO(null, request.getUsername(), request.getEmail(), Role.ROLE_ADMIN);
        return ResponseEntity.ok(userService.register(dto, request.getPassword()));
    }
    //đăng ký người dùng
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody UserRegisterRequest request) {
        UserDTO dto = new UserDTO(null, request.getUsername(), request.getEmail(), Role.ROLE_USER);
        return ResponseEntity.ok(userService.register(dto, request.getPassword()));
    }
    //lấy tất cả người dùng
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    //cập nhật người dùng
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable Long id, @RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }
    //xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    //lấy người dùng theo id
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO dto = userService.getUserById(id);
        return ResponseEntity.ok(dto);
    }
}
