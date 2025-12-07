package com.vpnconfig.app.models;

public class LoginResponse {
    public boolean success;
    public String token;
    public User user;

    public static class User {
        public String id;
        public String username;
        public String subscription_status;
        public String expiry_date;
    }
}

public class ConfigResponse {
    public boolean success;
    public Config config;

    public static class Config {
        public String id;
        public String name;
        public String type;
        public String server_address;
        public int port;
        public String protocol;
        public String credentials;
    }
}

public class ActivityLog {
    public String app_user_id;
    public String domain;
    public String application;
    public long bytes_sent;
    public long bytes_received;
    public String status;
}

public class VpnConnection {
    public String server;
    public int port;
    public String protocol;
    public String username;
    public String password;
    public String method;
}
