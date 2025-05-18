import { registry } from './registry'
import './auth'
import './product'
import './user'
import './category'
import './order'
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import yaml from 'yaml'
import fs from 'fs'
import path from 'path'

function getOpenApiDocumentation() {
    const generator = new OpenApiGeneratorV3(registry.definitions)

    return generator.generateDocument({
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'E-commerce API',
            description: 'E-commerce API documentations',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
    })
}

function writeDocumentation() {
    // OpenAPI JSON
    const docs = getOpenApiDocumentation()

    // YAML equivalent
    const fileContent = yaml.stringify(docs)
    fs.writeFileSync(path.join(__dirname, '../../openapi-docs.yml'), fileContent, {
        encoding: 'utf-8',
    })
}

writeDocumentation()
