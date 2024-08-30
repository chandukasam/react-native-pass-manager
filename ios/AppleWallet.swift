import PassKit

@objc(AppleWallet)
class AppleWallet: NSObject, PKAddPassesViewControllerDelegate {
    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?

    @objc(isWalletAvailable:rejecter:)
    func isWalletAvailable(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if PKPassLibrary.isPassLibraryAvailable() {
            resolve(true)
        } else {
            resolve(false)
        }
    }

    @objc(addPass:resolver:rejecter:)
    func addPass(_ base64EncodedPass: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject

        guard let passData = Data(base64Encoded: base64EncodedPass) else {
            reject("ERROR", "Invalid base64 string", nil)
            return
        }

        do {
            let pass = try PKPass(data: passData)
            showPassInWallet(pass: pass)
        } catch {
            reject("ERROR", "Failed to create PKPass", nil)
        }
    }

    @objc(saveToAppleWallet:resolver:rejecter:)
    func saveToAppleWallet(_ base64EncodedPass: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        addPass(base64EncodedPass, resolve: resolve, reject: reject)
    }

    private func showPassInWallet(pass: PKPass) {
        if let rootViewController = UIApplication.shared.windows.first?.rootViewController {
            let addPassesViewController = PKAddPassesViewController(pass: pass)
            addPassesViewController?.delegate = self
            rootViewController.present(addPassesViewController ?? UIViewController(), animated: true, completion: nil)
        } else {
            reject?("ERROR", "No rootViewController found", nil)
        }
    }

    func addPassesViewControllerDidFinish(_ controller: PKAddPassesViewController) {
        controller.dismiss(animated: true) {
            let result = ["success": true, "status": "didAddPasses"]
            self.resolve?(result)
            self.navigateToWallet()
        }
    }

    func addPassesViewControllerDidCancel(_ controller: PKAddPassesViewController) {
        controller.dismiss(animated: true) {
            let result = ["success": false, "status": "didAddPasses"]
            self.resolve?(result)
        }
    }

    private func navigateToWallet() {
        if let url = URL(string: "shoebox://"), UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
    }
}