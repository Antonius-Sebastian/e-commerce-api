import swaggerAutogen from 'swagger-autogen'

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Swagger Demo Project',
        description: 'Implementation of Swagger with TypeScript',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: '',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
        },
    },
}

const outputFile = './swagger_output.json'
const endpointsFiles = [
    './src/index.ts',
    // './src/routes/auth.routes.ts',
    // './src/routes/category.routes.ts',
    // './src/routes/order.routes.ts',
    // './src/routes/product.routes.ts',
    // './src/routes/user.routes.ts',
]

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc)
