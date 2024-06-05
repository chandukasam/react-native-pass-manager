
import PassKit

@objc(AppleWallet)
class AppleWallet: NSObject {
    @objc(isWalletAvailable:rejecter:)
    func isWalletAvailable(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if PKPassLibrary.isPassLibraryAvailable() {
            resolve(true)
        } else {
            resolve(false)
        }
    }

    @objc(saveToAppleWallet:resolver:rejecter:)
    func saveToAppleWallet(base64Encoded: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let passData = Data(base64Encoded: base64Encoded) else {
            reject("ERROR", "Failed to decode base64 string", nil)
            return
        }
        do {
            let pass = try PKPass(data: passData)
            let passLibrary = PKPassLibrary()
            passLibrary.addPasses([pass]) { status in
                switch status {
                case .shouldReviewPasses:
                    // Resolve the promise with an object that contains both pieces of information
                    resolve(["success": true, "status": "shouldReviewPasses"])
                case .didAddPasses:
                    // The pass was successfully added
                    resolve(["success": true, "status": "didAddPasses"])
                    // Open the Wallet app
                    if UIApplication.shared.canOpenURL(URL(string: "shoebox://")!) {
                        DispatchQueue.main.async {
                            UIApplication.shared.open(URL(string: "shoebox://")!, options: [:], completionHandler: nil)
                        }
                    }
                case .didCancelAddPasses:
                    // The adding of the pass was cancelled or should be reviewed
                    reject("ERROR", "Failed to add pass to Apple Wallet", nil)
                @unknown default:
                    // Handle any future cases
                    reject("ERROR", "Unknown status", nil)
                }
            }
        } catch {
            reject("ERROR", "Failed to create pass from data", error)
        }
    }
}
