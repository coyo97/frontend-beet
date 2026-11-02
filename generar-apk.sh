
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"

STATE="$ROOT/.local-apk-version"
APK="$ROOT/android/app/build/outputs/apk/release/app-release.apk"
OUTPUT="$ROOT/FootballRadar.apk"
DIST="$ROOT/dist"

echo "===================================="
echo "      FOOTBALL RADAR APK"
echo "      Compilacion local"
echo "===================================="

# Comprobar credenciales
test -f credentials.json || {
    echo "ERROR: Falta credentials.json"
    exit 1
}

test -f credentials/android/keystore.jks || {
    echo "ERROR: Falta keystore.jks"
    exit 1
}


# Valores de respaldo para la compilación.
# El usuario configura el servidor real desde la APK.
export EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_API_URL:-https://servidor-sin-configurar.invalid/api/v1}"

export EXPO_PUBLIC_SOCKET_URL="${EXPO_PUBLIC_SOCKET_URL:-https://servidor-sin-configurar.invalid}"

export EXPO_PUBLIC_RADAR_REFRESH_MS="${EXPO_PUBLIC_RADAR_REFRESH_MS:-30000}"

# Comprobar TypeScript
echo "Verificando TypeScript..."
npx tsc --noEmit

# Versiones locales: comenzamos en 100
# para superar las primeras compilaciones de EAS.
if [[ -f "$STATE" ]]; then
    LAST="$(cat "$STATE")"
else
    LAST=99
fi

[[ "$LAST" =~ ^[0-9]+$ ]] || {
    echo "ERROR: Numero de version invalido"
    exit 1
}

VERSION=$((LAST + 1))

echo "Compilando versionCode: $VERSION"

# Compilar localmente con recursos limitados
export NODE_ENV=production

cd "$ROOT/android"

./gradlew :app:assembleRelease \
    -PfootballRadarVersionCode="$VERSION" \
    -Pkotlin.compiler.execution.strategy=in-process \
    --max-workers=1 \
    --no-parallel \
    --no-daemon

# Validar resultado
test -f "$APK" || {
    echo "ERROR: Gradle no genero la APK"
    exit 1
}

# Comprobar firma y certificado original
APKSIGNER="$ANDROID_HOME/build-tools/36.0.0/apksigner"

EXPECTED="F77E2E62E70E29555729EF8D27C69B62169B28C90B4B74EDA41CFD5849613D"

ACTUAL="$(
    "$APKSIGNER" verify --print-certs "$APK" |
    awk -F ': ' '/Signer #1 certificate SHA-256 digest/ {
        print $2
        exit
    }' |
    tr '[:lower:]' '[:upper:]'
)"

if [[ "$ACTUAL" != "$EXPECTED" ]]; then
    echo "ERROR: La firma no coincide con el Keystore de EAS"
    exit 1
fi

# Guardar versiones
mkdir -p "$DIST"
cp "$APK" "$OUTPUT"
cp "$APK" "$DIST/FootballRadar-v${VERSION}.apk"

# Registrar version solamente despues del exito
printf '%s\n' "$VERSION" > "$STATE"

echo
echo "===================================="
echo " APK GENERADA CORRECTAMENTE"
echo "===================================="
echo "VersionCode: $VERSION"
echo "Archivo: $OUTPUT"
echo "Historial: $DIST/FootballRadar-v${VERSION}.apk"
echo "Firma EAS original: VERIFICADA"

