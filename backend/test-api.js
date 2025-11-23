import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3001'

// Función helper para hacer requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    console.log(`\n🔥 ${options.method || 'GET'} ${url}`)
    console.log(`Status: ${response.status} ${response.statusText}`)
    console.log('Response:', JSON.stringify(data, null, 2))

    return { response, data }
  } catch (error) {
    console.error(`❌ Error en ${url}:`, error.message)
    return { error }
  }
}

// Datos de prueba
const testUser = {
  email: 'test@email.com',
  password: 'password123',
  name: 'Usuario de Prueba',
  about: 'Desarrollador Full Stack',
}

let authToken = ''

async function testBackend() {
  console.log('🚀 Iniciando pruebas del backend...\n')

  // 1. Probar endpoint de salud
  await makeRequest('/')

  // 2. Registrar usuario
  const signupResult = await makeRequest('/signup', {
    method: 'POST',
    body: JSON.stringify(testUser),
  })

  if (signupResult.data && signupResult.data.token) {
    authToken = signupResult.data.token
    console.log('✅ Token guardado para siguientes requests')
  }

  // 3. Iniciar sesión (opcional, ya tenemos token del registro)
  await makeRequest('/signin', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }),
  })

  // 4. Obtener información del usuario actual
  await makeRequest('/users/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })

  // 5. Actualizar perfil
  await makeRequest('/users/me', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      name: 'Nombre Actualizado',
      about: 'Nueva descripción del perfil',
    }),
  })

  // 6. Actualizar avatar
  await makeRequest('/users/me/avatar', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      avatar: 'https://via.placeholder.com/150',
    }),
  })

  // 7. Obtener todos los usuarios
  await makeRequest('/users', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })

  // 8. Probar rutas con errores
  console.log('\n🧪 Probando manejo de errores...')

  // Email inválido
  await makeRequest('/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: 'email-invalido',
      password: 'password123',
    }),
  })

  // Contraseña muy corta
  await makeRequest('/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: 'nuevo@email.com',
      password: '123',
    }),
  })

  // Sin token de autorización
  await makeRequest('/users/me')

  // Token inválido
  await makeRequest('/users/me', {
    headers: {
      Authorization: 'Bearer token-invalido',
    },
  })

  console.log('\n🎉 Pruebas completadas!')
}

// Ejecutar pruebas
testBackend().catch(console.error)
