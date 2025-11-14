package com.example.Bike_store.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Bike_store.dto.UserDTO;
import com.example.Bike_store.entity.User;
import com.example.Bike_store.mapper.UserMapper;
import com.example.Bike_store.repository.UserRepository;
import com.example.Bike_store.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDTO register(UserDTO dto, String rawPassword) {
        String encoded = passwordEncoder.encode(rawPassword);
        User user = userMapper.toEntity(dto, encoded);
        return userMapper.toDTO(userRepository.save(user));
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id).orElseThrow();
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        
        return userMapper.toDTO(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        // 1. (Tùy chọn) Tìm user để đảm bảo tồn tại
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Xóa các thực thể con có khóa ngoại (Order, Cart, v.v.)
        // Ví dụ: orderRepository.deleteByUserId(id);

        // 3. Xóa user chính
        userRepository.delete(user);
    }

    @Override
    public UserDTO getUserById(Long id) {
        userRepository.findById(id).orElseThrow();
        return userMapper.toDTO(userRepository.findById(id).get());
    }
}
