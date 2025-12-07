package com.vpnconfig.app.api;

import com.vpnconfig.app.models.LoginResponse;
import com.vpnconfig.app.models.ConfigResponse;
import com.vpnconfig.app.models.ActivityLog;
import retrofit2.Call;
import retrofit2.http.*;

public interface ApiService {
    
    // Authentication
    @POST("auth/app/login")
    Call<LoginResponse> loginUser(@Body LoginRequest request);

    // Get app configuration
    @GET("android/{app_id}")
    Call<ConfigResponse> getAppConfig(@Path("app_id") String appId);

    // Get VPN configuration
    @GET("admin/config/{config_id}")
    Call<ConfigResponse> getVpnConfig(@Path("config_id") String configId,
                                      @Header("Authorization") String token);

    // Log user activity
    @POST("admin/monitoring/log")
    Call<ActivityLog> logUserActivity(@Body ActivityLog activity,
                                     @Header("Authorization") String token);

    // Verify API key
    @POST("android/verify-key")
    Call<AppVerifyResponse> verifyApiKey(@Body ApiKeyRequest request);
}

class LoginRequest {
    public String username;
    public String password;
    public String app_id;

    public LoginRequest(String username, String password, String app_id) {
        this.username = username;
        this.password = password;
        this.app_id = app_id;
    }
}

class ApiKeyRequest {
    public String api_key;

    public ApiKeyRequest(String api_key) {
        this.api_key = api_key;
    }
}

class AppVerifyResponse {
    public boolean success;
    public AppInfo app;
}

class AppInfo {
    public String id;
    public String app_name;
    public String version;
}
