import PassKit

@objc(AppleWallet)
class AppleWallet: NSObject, PKAddPassesViewControllerDelegate {
    var resolve: RCTPromiseResolveBlock?
    var reject: RCTPromiseRejectBlock?
    var pass: PKPass?

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
            self.pass = pass
            self.resolve = resolve
            self.reject = reject

            DispatchQueue.main.async {
                if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                   let rootViewController = scene.windows.first?.rootViewController {
                    let addPassesViewController = PKAddPassesViewController(pass: pass)
                    addPassesViewController?.delegate = self
                    rootViewController.present(addPassesViewController ?? UIViewController(), animated: true, completion: nil)
                } else {
                    reject("ERROR", "in line 37", nil)
                }
            }
        } catch {
            reject("ERROR", "in line 41", error)
        }
    }

    // PKAddPassesViewControllerDelegate method
    func addPassesViewControllerDidFinish(_ controller: PKAddPassesViewController) {
        controller.dismiss(animated: true) {
            let passLibrary = PKPassLibrary()
            if let pass = self.pass {
                if passLibrary.containsPass(pass) {
                    self.resolve?(["success": true, "status": "didAddPasses"])
                    self.showPassInWallet(pass)
                } else {
                    self.reject?("ERROR", "in line 54", nil)
                }
            } else {
                self.reject?("ERROR", "in line 57", nil)
            }
        }
    }

    private func showPassInWallet(_ pass: PKPass) {
        if let passURL = pass.passURL {
            DispatchQueue.main.async {
                UIApplication.shared.open(passURL, options: [:], completionHandler: { success in
                    if success {
                        // Optionally, you can add a delay to ensure the Wallet app is opened before returning the status
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                            self.resolve?(["success": true, "status": "didAddPasses"])
                        }
                    } else {
                        self.reject?("ERROR", "Failed to open Wallet app", nil)
                    }
                })
            }
        } else {
            self.reject?("ERROR", "Pass URL not found", nil)
        }
    }
}