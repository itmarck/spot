export const starter = {
  id: 'introduction',
  title: 'Introducción',
  description:
    'En esta documentación se detalla la API y los pasos requeridos para tener acceso a ella. Lo primero es tener una aplicación registrada para poder generar la autorización hacia el usuario y así obtener el token de acceso a la API. Con esta documentación estás listo para integrar el servicio dentro de tu aplicación de una manera fácil y sencilla.',
}

export const authorization = {
  id: 'authorization',
  title: 'Autorización',
  description:
    'Para obtener acceso el usuario tiene que autenticarse siguiendo el flujo de OAuth: Authorization Code. El servicio expone dos puntos para conectarse, uno para que el usuario autorice la aplicación y otro donde la aplicación solicita el token de acceso.',
  endpoints: [
    {
      id: 'authorize',
      title: 'Obtener autorización',
      description:
        'La aplicación que solicita el acceso envía al usuario a esta URL para que otorgue los permisos necesarios. El servidor de autorización redirigirá a <code>redirect_uri</code> agregando el código de autorización en la URL como parámetro (<code>code</code>). Luego ese código será usado para solicitar el token de acceso.',
      method: 'GET',
      path: '/oauth/authorize',
      params: [
        {
          name: 'client_id',
          type: 'string',
          place: 'query',
          description: 'Identificador del cliente.',
        },
        {
          name: 'redirect_uri',
          type: 'string',
          place: 'query',
          description: 'Opcional. Aquí se enviará el código de autorización.',
        },
        {
          name: 'code_challenge',
          type: 'string',
          place: 'query',
          description:
            'Código generado por el cliente para asegurar la autenticidad de la autorización.',
        },
      ],
      response: 'https://example.com/?code=1234',
    },
    {
      id: 'token',
      title: 'Solicitar token de acceso',
      description:
        'Una vez se reciba el código de autorización, es necesario solicitar el token de acceso para poder user la <a href="#rest-api" link>API</a>.',
      method: 'POST',
      path: '/oauth/token',
      params: [
        {
          name: 'code',
          type: 'string',
          place: 'body',
          description: 'Nombre del registro.',
        },
        {
          name: 'client_id',
          type: 'string',
          place: 'body',
          description: 'Identificador del cliente.',
        },
        {
          name: 'code_verifier',
          type: 'string',
          place: 'body',
          description:
            'Código recibido al momento de hacer la autorización. Se espera el mismo valor enviado en <code>code_challenge</code>.',
        },
      ],
      response: {
        token_type: 'Bearer',
        access_token: 'token',
      },
    },
  ],
}

export const reference = {
  id: 'rest-api',
  title: 'REST API',
  description: 'En esta sección se describe cómo usar la API de REST de Spot.',
  endpoints: [
    {
      id: 'get-authenticated-user',
      title: 'Obtener usuario autenticado',
      description:
        'Enumera la información pública del usuario si la cabecera de autorización es correcta.',
      method: 'GET',
      path: '/user',
      params: null,
      response: {
        email: 'user@example.com',
        name: 'John Due',
        avatar: 'https://avatar.com',
      },
    },
    {
      id: 'get-user-record',
      title: 'Obtener el registro de un usuario',
      description:
        'Muestra el valor de un registro para el usuario autenticado en esa aplicación.',
      method: 'GET',
      path: '/user/records/{name}',
      params: null,
      response: {
        name: 'theme',
        value: 'light',
      },
    },
    {
      id: 'set-user-record',
      title: 'Establecer el registro de un usuario',
      description:
        'Guarda un registro dentro de los registros del usuario autenticado en esa aplicación.',
      method: 'POST',
      path: '/user/records/{name}',
      params: [
        {
          name: 'name',
          type: 'string',
          place: 'query',
          description: 'Nombre del registro.',
        },
        {
          name: 'value',
          type: 'any',
          place: 'body',
          description: 'Valor del registro.',
        },
      ],
      response: {
        name: 'theme',
        value: 'dark',
      },
    },
    {
      id: 'delete-user-record',
      title: 'Elimina un registro de un usuario',
      description:
        'Elimina el registro de la lista de registros del usuario autenticado en esa aplicación.',
      method: 'DELETE',
      path: '/user/records/{name}',
      params: [
        {
          name: 'name',
          type: 'string',
          place: 'query',
          description: 'Nombre del registro a eliminar.',
        },
      ],
      response: {
        name: 'theme',
      },
    },
  ],
}
