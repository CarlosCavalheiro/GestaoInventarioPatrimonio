# 📦 Sistema de Inventário de Patrimônio  

Este é um sistema web moderno e responsivo para a gestão e conferência de patrimônios.  
Desenvolvido com uma **arquitetura desacoplada** (Frontend e Backend), o sistema permite:  

- Que **administradores** cadastrem Patrimônios, Locais, Usuário, Sessões e Relatórios de conferência.  
- Que **funcionários** realizem a conferência de itens em campo usando um dispositivo móvel.  

---

## 🚀 Tecnologias  

### Frontend  
- **React.js** → Biblioteca JavaScript para construção da interface de usuário.  
- **Vite** → Ferramenta de build rápida e moderna para o desenvolvimento.  
- **Tailwind CSS** → Framework utilitário para design responsivo e ágil.  
- **React Router DOM** → Gerenciamento de navegação e rotas.  
- **react-webcam** e **jsQR** → Acesso à câmera e leitura de QR Codes.  

### Backend  
- **ASP.NET Core 9.0** → Framework da Microsoft para construção da API.  
- **C#** → Linguagem de programação principal.  
- **Entity Framework Core** → ORM para interação com o banco de dados.  
- **MySQL** → Banco de dados relacional.  
- **Azure Blob Storage** → Armazenamento de arquivos em nuvem para as fotos dos itens.  

---

## ✨ Funcionalidades  
- 🔐 **Login Seguro** → Autenticação via JWT e autorização por perfis (administrador e funcionário).  
- 📱 **Conferência Mobile** → Formulário otimizado para celulares.  
- 📷 **Leitura de QR Code** → Identificação automática de itens com a câmera do dispositivo.  
- 🖼️ **Captura de Foto** → Anexar fotos aos itens conferidos.  
- 📊 **Relatórios Detalhados** → Inconsistências (itens não encontrados, em locais errados, etc.).  
- ⚙️ **Gerenciamento de Dados** → CRUD completo de usuários, locais e patrimônios.  

---

## ⚙️ Pré-requisitos  

Para rodar o projeto localmente, é necessário ter instalado:  

- **.NET SDK** → Versão **9.0** ou superior.  
- **Node.js** → Versão **20.x** ou superior + **npm**.  
- **MySQL Server** ou acesso a uma instância em nuvem (Amazon RDS ou Azure Database for MySQL).  
- **IDE** → Visual Studio Code ou outra de sua preferência.  

---

## Desenvolvedor
Carlos Alexandre Cavalheiro
- Email: ocarlosleu@gmail.com
- LinkedIn: https://www.linkedin.com/in/cavalheiro-ca/
