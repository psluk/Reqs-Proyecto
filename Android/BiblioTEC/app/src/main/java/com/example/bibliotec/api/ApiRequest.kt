package com.example.bibliotec.api

import android.content.Context
import com.google.gson.Gson
import com.google.gson.JsonObject
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import java.io.IOException

class ApiRequest private constructor(context : Context) {
    private val client = OkHttpClient()
    private val gson = Gson()
    private val context: Context = context
    private val cookieJar = CookieStorage(context)

    companion object {

        @Volatile
        private var instance: ApiRequest? = null

        fun getInstance(context : Context) =
            instance ?: synchronized(this) {
                instance ?: ApiRequest(context).also {
                    instance = it
                }
            }
    }

    fun getRequest(url: String): Pair<Boolean, String> {
        val httpUrl = url.toHttpUrlOrNull()!!
        val cookies = cookieJar.loadForRequest(httpUrl)
        val request = Request.Builder()
            .url(url)
            .header("Cookie", cookies.joinToString("; "))
            .build()

        val response = client.newCall(request).execute()

        return response.use { response : Response ->
            var responseString = response.body?.string() ?: ""
            var status = true
            if (!response.isSuccessful) {
                status = false
                responseString = try {
                    val json = gson.fromJson(responseString, JsonObject::class.java)
                    if (json.has("message")) {
                        json.get("message").asString
                    } else {
                        "Error inesperado:\n${response.message}"
                    }
                } catch (e: Exception) {
                    "Error inesperado"
                }
            }
            Pair(status, responseString)
        }
    }

    fun putRequest(url: String, requestBody: RequestBody): Pair<Boolean, String> {
        val httpUrl = url.toHttpUrlOrNull()!!
        val request = Request.Builder()
            .url(url)
            .header("Cookie", cookieJar.loadForRequest(httpUrl).joinToString("; "))
            .put(requestBody)
            .build()

        val response = client.newCall(request).execute()

        return response.use { response : Response ->
            var responseString = response.body?.string() ?: ""
            var status = true
            if (!response.isSuccessful) {
                status = false
                try {
                    val json = gson.fromJson(responseString, JsonObject::class.java)
                    responseString = if (json.has("message")) {
                        json.get("message").asString
                    } else {
                        "Error inesperado:\n${response.message}"
                    }
                } catch (e: Exception) {
                    responseString = "Error inesperado"
                }
            } else {
                // Se guardan las cookies
                try {
                    val httpUrl = url.toHttpUrlOrNull()!!
                    val cookies =
                        response.headers("Set-Cookie").mapNotNull { Cookie.parse(httpUrl, it) }
                    cookieJar.saveFromResponse(httpUrl, cookies)
                } catch (e: Exception) {

                }
            }
            Pair(status, responseString)
        }
    }

    fun postRequest(url: String, requestBody: RequestBody): Pair<Boolean, String> {
        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .build()

        var response : Response

        try {
            response = client.newCall(request).execute()
        } catch (e: Exception) {
            return Pair(false, "Error de red")
        }

        return response.use { response : Response ->
            var responseString = response.body?.string() ?: ""
            var status = true
            if (!response.isSuccessful) {
                status = false
                try {
                    val json = gson.fromJson(responseString, JsonObject::class.java)
                    responseString = if (json.has("message")) {
                        json.get("message").asString
                    } else {
                        "Error inesperado:\n${response.message}"
                    }
                } catch (e: Exception) {
                    responseString = "Error inesperado"
                }
            } else {
                // Se guardan las cookies
                try {
                    val httpUrl = url.toHttpUrlOrNull()!!
                    val cookies =
                        response.headers("Set-Cookie").mapNotNull { Cookie.parse(httpUrl, it) }
                    cookieJar.saveFromResponse(httpUrl, cookies)
                } catch (e: Exception) {

                }
            }
            Pair(status, responseString)
        }
    }
}
