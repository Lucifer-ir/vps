package com.vpnconfig.app.api;

import java.io.IOException;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import com.vpnconfig.app.utils.SharedPrefManager;

public class ApiClient {
    private static Retrofit retrofit = null;
    private static final String BASE_URL = "http://localhost:5000/api/";

    public static Retrofit getClient(android.content.Context context) {
        if (retrofit == null) {
            OkHttpClient.Builder httpClient = new OkHttpClient.Builder();
            
            // Add token interceptor
            httpClient.addInterceptor(new Interceptor() {
                @Override
                public Response intercept(Chain chain) throws IOException {
                    Request original = chain.request();
                    String token = SharedPrefManager.getInstance(context).getToken();
                    
                    Request.Builder requestBuilder = original.newBuilder();
                    if (token != null) {
                        requestBuilder.header("Authorization", "Bearer " + token);
                    }
                    
                    Request request = requestBuilder.build();
                    return chain.proceed(request);
                }
            });

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(httpClient.build())
                    .build();
        }
        
        return retrofit;
    }
}
