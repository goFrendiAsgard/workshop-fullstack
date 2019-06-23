# Workshop Fullstack 2019

## Goal

Providing overview of fullstack engineering (backend + frontend)

## Tech stack

* Apriary (API mock) https://todolist86.docs.apiary.io/#
* Docker (Backend), for NATS & mongoDB
    - docker run --name mongo -p 27017:27017 -it -d mongo
    - docker run --name nats -p 4222:4222 -p 6222:6222 -p 8222:8222 -d nats
* Minikube (Backend), if possible
* Node.Js (Backend)
* React.Js (Frontend)

## Tasks

* Define Endpoints + data structure
* Build Backend + Frontend

## Case Study

* TODO List app
* 3 Endpoints:
    - fetch
    - insert
    - update

## Spec

* Backend (Go)
    - [x] 2 Services: one for save, one for fetch
    - [x] REST-like endpoints
    - [x] Gateway
    - [ ] Unittest
    - [ ] Integration test

* Frontend (Fahmi)
    - [ ] Offline first
    - [ ] Using react
