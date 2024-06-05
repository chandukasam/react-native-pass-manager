package com.passmanager

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import com.google.android.gms.pay.Pay
import com.google.android.gms.pay.PayApiAvailabilityStatus
import com.google.android.gms.pay.PayClient

class GoogleWalletModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), ActivityEventListener {
  private val addToGoogleWalletRequestCode = 1000
  private val walletClient: PayClient = Pay.getClient(reactContext)

  init {
    reactContext.addActivityEventListener(this)
  }

  override fun getName(): String {
    return "GoogleWallet"
  }

  @ReactMethod
  fun isWalletAvailable(promise: Promise) {
    walletClient
      .getPayApiAvailabilityStatus(PayClient.RequestType.SAVE_PASSES)
      .addOnSuccessListener { status ->
        print("status: $status")
        promise.resolve(status == PayApiAvailabilityStatus.AVAILABLE)
      }
      .addOnFailureListener {
        print("status: $it")
        promise.reject("ERROR", it)
      }
  }

  @ReactMethod
  fun saveToGoogleWallet(jwt: String) {
    val activity: Activity? = currentActivity
    if (activity != null) {
      try {
        walletClient.savePassesJwt(jwt, activity, addToGoogleWalletRequestCode)
      } catch (e: Exception) {
        e.printStackTrace()
        if (e is com.google.android.gms.common.api.ApiException) {
          val status = com.google.android.gms.common.api.CommonStatusCodes.getStatusCodeString(e.statusCode)
          print("Google Pay API error occurred: $status")
        }
      }
    }
  }

  override fun onActivityResult(
    activity: Activity,
    requestCode: Int,
    resultCode: Int,
    data: Intent?
  ) {
    if (requestCode == addToGoogleWalletRequestCode) {
      when (resultCode) {
        Activity.RESULT_OK -> {
          // The operation was successful
          print("Operation was successful")
        }

        Activity.RESULT_CANCELED -> {
          // The operation was not successful
          print("Operation was not successful")
        }

        else -> {
          // An error occurred
          val error = data?.getStringExtra("error")
          print("An error occurred: $error")
        }
      }
    }
  }

  override fun onNewIntent(intent: Intent?) {
    /*only the method initializaion needed */
  }
}
