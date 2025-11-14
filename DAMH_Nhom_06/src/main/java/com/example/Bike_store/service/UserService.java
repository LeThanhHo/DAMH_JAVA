package com.example.Bike_store.service;

import java.util.List;

import com.example.Bike_store.dto.UserDTO;

public interface UserService {
    UserDTO register(UserDTO dto, String rawPassword);
    List<UserDTO> getAllUsers();
    UserDTO updateUser(Long id, UserDTO dto);
    void deleteUser(Long id);
    UserDTO getUserById(Long id);
}