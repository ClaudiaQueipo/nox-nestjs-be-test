# Nox Creation Desafío de código para desarrolladora backend
Crear una API basada en las siguientes entidades: Cliente, Restaurante y Orden.

Client: 

- Name 

- Email 

- Phone 

- Age 

Restaurant: 

- Name 

- Address 

- Capacity 

- Clients 

Order: 

- Description 

- Client 

- Restaurant

 

Considerar restricciones como capacidad máxima de clientes y solo permitir adultos.

## Instalación del proyecto

### Usando Docker

```bash
docker-compose up -d --build
```
### Sin usar Docker

1. Instalar las dependencias
```bash
yarn install
```
2. Instalar la base de datos de PostgreSQL
3. modificar el archivo .env para configurar las variables de entorno de la base de datos