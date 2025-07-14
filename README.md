🛒 Vendas Online - Backend

Backend da aplicação de vendas desenvolvida com NestJS, oferecendo endpoints REST para autenticação, gerenciamento de produtos, categorias, busca e checkout.

📚 Visão Geral

Este repositório contém o back-end do Vendas Online App, implementado com NestJS e banco de dados PostgreSQL. Ele fornece suporte completo à aplicação mobile com rotas seguras, controle de usuários e recursos de catálogo com filtros, paginação e categorias.

⚙️ Funcionalidades

🔐 Autenticação JWT (Login e Cadastro)

🛍️ Gerenciamento de Produtos

📁 Categorias de Produtos

🔍 Busca com Filtros e Paginação

🧾 Criação e listagem de Pedidos (Checkout)

O front-end do app está disponível aqui: https://github.com/brunavarela/vendas-online-app

🧪 Tecnologias Utilizadas
NestJS

TypeORM

PostgreSQL

Passport + JWT

Axios

Class-validator + Class-transformer

# Clone o repositório
git clone https://github.com/seuusuario/vendas-online-backend.git

# Acesse a pasta do projeto
cd vendas-online-backend

# Instale as dependências
npm install


🔐 Autenticação

O projeto utiliza autenticação baseada em JWT. Após o login, você receberá um access_token que deve ser enviado no header das requisições protegidas.


📬 Endpoints

GET

Buscar usuário: /user/all

Buscar dados do usuário logado: /user

Buscar todos os usuários por id: /user/id

Buscar meus endereços: /address

Buscar todas as categorias: /category

Buscar categoria pelo id: /category/id

Buscar todos os produtos: /products

Buscar todos os produtos paginados:/product/page?search=sapatos

Buscar detalhes de um produto: /products/id

Buscar carrinho: /cart

Buscar pedidos do usuário: /order/

Buscar todos os pedidos: /order/all

Buscar detalhes do pedido: /order/id

POST

Criar usuário: /user

Criar admin: /user/admin

Criar endereços: /address

Fazer login: /auth

Criar categorias: /category

Criar produtos: /products

Criar carrinho: /cart

Criar pedido: /order

PATCH

Atualizar senha: /user

Atualizar quantidade de produto no carrinho: /cart

PUT

Editar categoria: /category/id

Editar produto: /product/id

DELETE 

Deletar categoria: /category/id

Deletar produto: /product/id

Limpar carrinho: /cart

Remover produto do carrinho: /cart/product/id


📌 Todos os endpoints de produtos, pedidos e categorias requerem token JWT autenticado.


Desenvolvido por Bruna Varela
