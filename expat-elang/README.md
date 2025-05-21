# Expat Elang Mobile App

Aplikasi mobile untuk platform Expat Elang yang dibangun menggunakan React Native.

## 🚀 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- **Node.js** (versi LTS terbaru)
- **Java Development Kit (JDK)** versi 17 atau lebih baru
- **Android Studio** dengan:
  - Android SDK
  - Android SDK Platform-Tools
  - Android SDK Build-Tools
- **Konfigurasi Environment Variables**:
  - `ANDROID_HOME`: Path ke Android SDK
  - `PATH`: Tambahkan path ke platform-tools dan tools

## 📦 Instalasi

1. Clone repository ini
2. Masuk ke direktori project:
   ```bash
   cd expat-elang
   ```
3. Install dependencies:
   ```bash
   yarn install
   # atau
   npm install
   ```
4. (Opsional) Install assets dan font:
   ```bash
   npx react-native-asset
   ```

## 🏃‍♂️ Menjalankan Aplikasi

### Development Mode

1. Pastikan device Android atau emulator sudah terhubung
2. Buka terminal pertama dan jalankan Metro bundler:
   ```bash
   yarn start
   # atau
   npm start
   ```
3. Buka terminal kedua dan pilih salah satu perintah berikut:

   **Development Environment:**
   ```bash
   yarn android:dev
   # atau
   npm run android:dev
   ```

   **Production Environment:**
   ```bash
   yarn android:prod
   # atau
   npm run android:prod
   ```

   **Default Environment:**
   ```bash
   yarn android
   # atau
   npm run android
   ```

### Build APK

#### Development Environment

1. **Build Debug APK:**
   ```bash
   yarn build:android:dev
   # atau
   npm run build:android:dev
   ```

2. **Build Release APK:**
   ```bash
   yarn build:android:dev:apk
   # atau
   npm run build:android:dev:apk
   ```

#### Production Environment

1. **Build Debug APK:**
   ```bash
   yarn build:android:prod
   # atau
   npm run build:android:prod
   ```

2. **Build Release APK:**
    ```bash
   yarn build:android:prod:apk
   # atau
   npm run build:android:prod:apk
   ```

### Lokasi Output APK

- **Debug APK:**
  ```
  android/app/build/outputs/apk/dev/debug/app-dev-debug.apk
  android/app/build/outputs/apk/prod/debug/app-prod-debug.apk
  ```

- **Release APK:**
  ```
  android/app/build/outputs/apk/dev/release/app-dev-release.apk
  android/app/build/outputs/apk/prod/release/app-prod-release.apk
  ```

## 🔧 Script NPM/Yarn

### Development
- `yarn start` - Menjalankan Metro bundler
- `yarn android` - Menjalankan aplikasi di Android (default environment)
- `yarn android:dev` - Menjalankan aplikasi di Android dengan environment development
- `yarn android:prod` - Menjalankan aplikasi di Android dengan environment production
- `yarn ios` - Menjalankan aplikasi di iOS (hanya untuk macOS)

### Build
- `yarn build:android:dev` - Build APK debug untuk environment development
- `yarn build:android:dev:apk` - Build APK release untuk environment development
- `yarn build:android:prod` - Build APK debug untuk environment production
- `yarn build:android:prod:apk` - Build APK release untuk environment production

### Testing & Linting
- `yarn test` - Menjalankan unit tests dengan Jest
- `yarn lint` - Menjalankan ESLint untuk code quality check

### Utilitas
- `yarn log` - Menampilkan log Android untuk debugging

## 📝 Catatan Penting

1. **Environment Files:**
   - Development: `.env.development`
   - Production: `.env.production`

2. **Keystore:**
   - Pastikan file `my-release-key.keystore` ada di folder `android/app/`
   - Untuk build release, rename file backup:
     ```bash
     # Linux/macOS
     mv android/app/my-release-key.keystore.bak android/app/my-release-key.keystore
     
     # Windows (CMD)
     ren android\app\my-release-key.keystore.bak my-release-key.keystore
     
     # Windows (PowerShell)
     Rename-Item -Path android/app/my-release-key.keystore.bak -NewName my-release-key.keystore
     ```
