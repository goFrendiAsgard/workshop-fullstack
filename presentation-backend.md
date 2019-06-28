# Microservice vs Monolithic

![microservice vs monolithic](images/microservice-vs-monolithic.png)

## Monolithic

* Easy to develop, deploy, and debug
* Cannot be scaled independently

## Microservice

* Difficult to develop, deploy, and debug
* Can be scaled independently

# Microservice Communication

## Request/Response

![request-response](images/request-response.png)

### Problem with Request/Response

![request-response-problem](images/request-response-problem.png)

* Service Discovery
* Error Recovery (solution: Saga Pattern)

## Pub/Sub

![pub-sub](images/pub-sub.png)

### Problem With Pub/Sub

* Bottle neck
* Single point of failure

# Our Architecture

![architecture](images/architecture.png)

