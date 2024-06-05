#import <React/RCTBridgeModule.h>
#import <PassKit/PassKit.h>

@interface RCT_EXTERN_MODULE(AppleWallet, NSObject)

RCT_EXTERN_METHOD(isWalletAvailable: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(saveToAppleWallet: (NSString *)passPath
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)


+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end
