# Typescript template for OpenFaaS

This template is based on the official `node12` template from OpenFaaS. It allows you to write your function in Typescript, that will be compiled to javascript during the build process.

## Usage

```shell
faas-cli template pull https://github.com/nanopils/openfaas-template-typescript
faas-cli new <my-typescript-function> --lang ts-node
```