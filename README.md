# ServerMessenger-ND

### Módulo para tener organizado todos los mensajes de respuesta del servidor y responder siempre de manera similar.

## `ServerMessenger(Error, Success) `

##### Va a contener todos los mensajes del servidor. Recibe dos objetos: uno para los errores; el otro para los mensajes de éxito.

- sendMessageOk(string)
- sendMessageError(string) || sendMessageError( "" , error, " ubicación del error")

​

para utilizar sendMessageError:

```typescript
try {
  sendMessageError(string)
} catch (error) {
  sendMessageError('', error, ' ubicación del error')
}
```

## `ResponseND(string)`

##### Va a responder al cliente. Recibe un string, el cual va será utilizado para responder cuando ocurra un error inesperado.

- success({ res , clientMsg, data })
- error({res , err})

## Formato de respuesta

### success

```typescript
{
  error: '',
  body: {
    message: 'Mensaje',
    data: '' || data
  }
}
```

### error

```typescript
{
  error: "Mensaje de error"
  body: '',
}
```

## config.js

```typescript
//@ts-check
import { ServerMessenger, ResponseND } from 'servermessenger-nd'

const errors = {
  sintaxError: { clientMsg: 'Error de sintaxis. Faltan datos', code: 400 },
  notFound: { clientMsg: 'No se encontro lo que estás buscando.', code: 404 },
  notFoundMsg: { clientMsg: 'No se encontraron mensajes', code: 404 },
}

const success = {
  notFoundMsg: { clientMsg: 'No hay mensajes para mostrar.', code: 200 },
  addOk: { clientMsg: 'Se agrego correctamente el mensaje', code: 202 },
  success: { clientMsg: 'Todo salio bien.', code: 200 },
  updateOk: { clientMsg: 'Se modificó correctamente el mensaje', code: 202 },
}

const customMSG = 'Error inesperado. Pronto estaremos trabajando para resolverlo.'

const SM = new ServerMessenger(errors, success)
const Resp = new ResponseND(customMSG)

export { SM, Resp }
```

## server.js

```typescript
//@ts-check
import express from 'express'
import { SM, Resp } from './config.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  Resp.success({
    res,
    clientMsg: SM.sendMessageOk('success'),
    data: '',
  })
})

app.listen(5000, () => console.log('Server ON'))
```

![image-20220208113825605](https://user-images.githubusercontent.com/74759684/153309521-23257795-eca5-4214-b865-593d7a525b91.png)

```typescript
app.get('/info', (req, res) => {
  const info = {
    nombre: 'jose',
    email: 'herrera00jl@gmail.com',
  }
  Resp.success({
    res,
    clientMsg: SM.sendMessageOk('success'),
    data: info,
  })
})
```

![image-20220208115659710](https://user-images.githubusercontent.com/74759684/153309564-92c8de15-bac4-464b-8e68-130c0fca800f.png)

```typescript
app.post('/', (req, res) => {
  try {
    const { nombre, email } = req.body
    if (!nombre || !email) {
      throw SM.sendMessageError('sintaxError')
    }

    if (nombre === 'Error') {
      throw new Error('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    }

    Resp.success({
      res,
      clientMsg: SM.sendMessageOk('addOk'),
      data: { nombre, email },
    })
  } catch (error) {
    Resp.error({
      res,
      err: error,
    })
  }
})
```

### Error esperado

![image-20220208121228327](https://user-images.githubusercontent.com/74759684/153309543-9758cf45-1408-4a49-b14a-e0d723d7c92e.png)

### Sin errores

![image-20220208121347664](https://user-images.githubusercontent.com/74759684/153309581-1146f457-e1ef-413d-be76-b1161dd98ff4.png)

###

### Error inesperado

![image-20220208121800359](https://user-images.githubusercontent.com/74759684/153309589-04a80684-7d62-4349-a902-774a73589e9f.png)

# RASTREAR EL ERROR

- Es posible saber el origen de un error.

El controlador tiene que agregar un usuario. Le pasamos la info y esperamos la respuesta.

```typescript
app.post('/add', (req, res) => {
  try {
    const info = {
      nombre: req.body.nombre,
      email: req.body.email,
    }

    const resp = controller.addUser(info)

    Resp.success({
      res,
      clientMsg: SM.sendMessageOk('addOk'),
      data: resp,
    })
  } catch (error) {
    if (error.serverMsg) {
      console.log(`${error.serverMsg}  -- ${error.from}`)
    }

    Resp.error({
      res,
      err: error,
    })
  }
})
```

## controller.js

```typescript
import { SM } from './config.js'

const addUser = (info) => {
  try {
    const { nombre, email } = info

    if (!nombre || !email) {
      throw SM.sendMessageError('sintaxError')
    }

    if (nombre === 'Error') {
      throw new Error('Error inesperado')
    }

    const data = {
      nombre,
      email,
    }

    return data
  } catch (error) {
    throw SM.sendMessageError('', error, '[ POST - addUser ]')
  }
}

const controller = {
  addUser,
}

export { controller }
```

Cuando ocurre un error desconocido, este no tendrá la propiedad "clientMsg" , por lo tanto el cliente verá

el mensaje que le pusimos cuando configuramos ResponseND.

```typescript
const customMSG = 'Error inesperado. Pronto estaremos trabajando para resolverlo.'
```

Al lanzar el error con este formato...

```typescript
throw SM.sendMessageError('', error, '[ POST - addUser ]')
```

el método que captura esa excepcion , recibirá el error con el siguiente formato.

```typescript
{ from: '[ POST - addUser ]', serverMsg: 'Error inesperado' }
```

En vez de utilizar un `console.log` se puede utilizar algun logger para guardar en un archivo cuando pase algo inesperado.

```typescript
if (error.serverMsg) {
  console.log(`${error.serverMsg}  -- ${error.from}`)
}
```
