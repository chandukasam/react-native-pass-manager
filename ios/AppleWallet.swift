import PassKit

@objc(AppleWallet)
class AppleWallet: NSObject, PKAddPassesViewControllerDelegate {
    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?
    private var passAdded: Bool = false
    private var pass: PKPass?

    @objc(saveToAppleWallet:resolver:rejecter:)
    func saveToAppleWallet(_ base64EncodedPass: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject
        self.passAdded = false
        self.addPass(base64EncodedPass, resolve: resolve, reject: reject)
    }

    @objc(isWalletAvailable:rejecter:)
    func isWalletAvailable(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if PKPassLibrary.isPassLibraryAvailable() {
            resolve(true)
        } else {
            reject("ERROR", "Wallet is not available", nil)
        }
    }

    @objc(openPassInWallet:resolver:rejecter:)
    func openPassInWallet(_ passURL: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if let url = URL(string: passURL), UIApplication.shared.canOpenURL(url) {
            print("Opening specific pass in Wallet")
            UIApplication.shared.open(url, options: [:], completionHandler: { success in
                if success {
                    resolve(true)
                } else {
                    reject("ERROR", "Failed to open Wallet", nil)
                }
            })
        } else {
            print("Cannot open Wallet URL")
            reject("ERROR", "Cannot open Wallet URL", nil)
        }
    }

    @objc(isPassInWallet:serialNumber:resolver:rejecter:)
    func isPassInWallet(_ passTypeIdentifier: String, serialNumber: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let passLibrary = PKPassLibrary()
        let passes = passLibrary.passes().filter { $0.passTypeIdentifier == passTypeIdentifier }

        // Debugging: Print all passes
        print("All passes:")
        for pass in passLibrary.passes() {
            print("Pass Type Identifier: \(pass.passTypeIdentifier), Serial Number: \(pass.serialNumber)")
        }

        let passExists = passes.contains { $0.serialNumber == serialNumber }
        print("Pass exists: \(passExists)")
        resolve(passExists)
    }

    private func addPass(_ base64EncodedPass: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let passData = Data(base64Encoded: base64EncodedPass),
              let pass = try? PKPass(data: passData)
        else {
            print("Failed to create PKPass")
            reject("ERROR", "Failed to create PKPass", nil)
            return
        }
        print("PKPass created successfully")
        self.pass = pass
        self.showPassInWallet(pass: pass)
    }

    private func showPassInWallet(pass: PKPass) {
        if let rootViewController = UIApplication.shared.windows.first?.rootViewController {
            let addPassesViewController = PKAddPassesViewController(pass: pass)
            addPassesViewController?.delegate = self
            print("Presenting PKAddPassesViewController")
            rootViewController.present(addPassesViewController ?? UIViewController(), animated: true, completion: nil)
        } else {
            print("No rootViewController found")
            self.reject?("ERROR", "No rootViewController found", nil)
        }
    }

    func addPassesViewControllerDidFinish(_ controller: PKAddPassesViewController) {
        controller.dismiss(animated: true) {
            let passLibrary = PKPassLibrary()
            if let pass = self.pass, passLibrary.containsPass(pass) {
                print("User pressed Add")
                let passTypeIdentifier = pass.passTypeIdentifier
                let serialNumber = pass.serialNumber
                let passURL = "shoebox://pass/\(passTypeIdentifier)/\(serialNumber)"
                let result = ["success": true, "status": "didAddPasses", "passURL": passURL]
                print(result)
                self.resolve?(result)
                self.navigateToWallet()
            } else {
                print("User pressed Cancel")
                let result = ["success": false, "status": "didCancel"]
                self.resolve?(result)
            }
            self.clearCachedVariables()
        }
    }

    private func navigateToWallet() {
        if let url = URL(string: "shoebox://"), UIApplication.shared.canOpenURL(url) {
            print("Navigating to Wallet")
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        } else {
            print("Cannot open Wallet URL")
        }
    }

    private func clearCachedVariables() {
        print("Clearing cached variables")
        self.resolve = nil
        self.reject = nil
        self.passAdded = false
        self.pass = nil
    }
}
