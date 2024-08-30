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
    let scenes = UIApplication.shared.connectedScenes
    print("Connected scenes: \(scenes)")
    
    if let scene = scenes.first as? UIWindowScene {
        print("Found UIWindowScene: \(scene)")
        
        if let window = scene.windows.first {
            print("Found window: \(window)")
            
            if let rootViewController = window.rootViewController {
                print("Found rootViewController: \(rootViewController)")
                
                let addPassesViewController = PKAddPassesViewController(pass: pass)
                addPassesViewController?.delegate = self
                rootViewController.present(addPassesViewController ?? UIViewController(), animated: true, completion: nil)
            } else {
                print("No rootViewController found")
                reject("ERROR", "No rootViewController found", nil)
            }
        } else {
            print("No window found")
            reject("ERROR", "No window found", nil)
        }
    } else {
        print("No UIWindowScene found")
        reject("ERROR", "No UIWindowScene found", nil)
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
                    self.resolve?(["success": false, "status": "didAddPasses"])
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