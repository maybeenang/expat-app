## Requirements

- Node.js (LTS)
- JDK (v17+)
- Android Studio (SDK & Tools)
- Konfigurasi `ANDROID_HOME` & `PATH`

## Instalasi

1.  `npm install` atau `yarn install`
2.  **(Opsional: Font/Aset)** `npx react-native-asset`

## Menjalankan (Debug)

1.  Hubungkan device/emulator.
2.  Terminal 1: `npm start -- --reset-cache` (atau `yarn start ...`)
3.  Terminal 2: `npm run android` (atau `yarn android`)

## Build Release APK (Android)

1.  **Keystore:** Pastikan file `my-release-key.keystore` ada di `android/app/`.
2.  **Rename Keystore :**
    - **Linux/macOS:** `mv android/app/my-release-key.keystore.bak android/app/my-release-key.keystore`
    - **Windows (CMD):** `ren android\app\my-release-key.keystore.bak my-release-key.keystore`
    - **Windows (PowerShell):** `Rename-Item -Path android/app/my-release-key.keystore.bak -NewName my-release-key.keystore`
3.  **Build:**
    ```bash
    cd android
    ./gradlew assembleRelease
    cd ..
    ```
    _(Gunakan `gradlew assembleRelease` di Windows)_
4.  **Hasil:** APK ada di `android/app/build/outputs/apk/release/app-release.apk`.
