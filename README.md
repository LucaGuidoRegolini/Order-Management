# Order Management

![GitHub repo size](https://img.shields.io/github/repo-size/LucaGuidoRegolini/Order-Management?style=flat-square)
![GitHub license](https://img.shields.io/github/license/LucaGuidoRegolini/Order-Management?style=flat-square)
![Gitthub top languagem](https://img.shields.io/github/languages/top/LucaGuidoRegolini/Order-Management)


An api integrated with the pipedrive sales platform
Made in typescript, containerized with docker-compose 

## Modules

* Create update User
* Login, Logout and Refresh Session
* Update Avatar User
* Secure password recovery and change
* Email confirmation
* Automatic sync with Pipedrive
* Search for orders registered on the platform
* Automated tests
* Continuous integration script

## 🚀 Installation

> it is necessary to have node and docker-compose installed on the machine

1. Clone the repository to your computer

```
git clone https://github.com/LucaGuidoRegolini/Order-Management.git
```

2. Install the depedencies

```
npm i
```

3. Configure the .env
+ copy the .env.example file
+ add the necessary information

>beware of variables ending in **_PORT**, make sure that no other application is working on the ports defined in them

4. Create the containers
```
docker-compose up -d
```

5. With the containers running, run the database migrations
```
npm run typeorm migration:run
```

After the steps, the application will be working on the port informed in **API_PORT** in the .env

## 🌐 WebApllication

This project is runing in the AWS server, and can be accessed here

[Order Management](http://ec2-54-90-242-30.compute-1.amazonaws.com/)

## ☕ Using

The aplication is a REST API, you must use the HTTP protocol for your communication

It is recommended to use a Rest client with **Postman** or **Insomnia**

### Documentation

The documentation was made through postman and can be accessed here

[Postman Documentation](https://www.postman.com/speeding-escape-366395/workspace/order-management/overview)

## 👨‍💻 Technologies

### Typescript

All aplication is make in typescript, a modern and powerfull lenguage 

### NodeJs

The code runing in NodeJs, an open-source, cross-platform, back-end JavaScript runtime

### Docker

Docker is a set of platform as a service (PaaS) products that use OS-level virtualization to deliver software in packages called containers

### Docker-compose

A tool for defining and running multi-container Docker applications

### Postgress

A SQL Database, widely used in the market

### AWS

A cloud service on Amazon to host applications

### Github Actions

tool to do seamless integration with the server