package com.example.Bike_store.service;

import java.util.Map;

public interface AuthService {
    Map<String, Object> login(String username, String password);
}