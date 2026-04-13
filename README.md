# ReFrame Node MVP (React + Three.js)

MVP web app para visualizar o componente modular **ReFrame Node** com foco em:

- estrutura modular
- interfaces destacáveis
- lógica circular (reduzir, reutilizar, reciclar)

## Funcionalidades

- Visualização 3D com `three`:
  - beam central (2.0 x 0.2 x 0.2)
  - módulos laterais destacáveis
  - parafusos e padrão de furação
- Interações:
  - OrbitControls (girar/zoom)
  - modo explodido / montagem
  - destaque no hover
- Simulação de circularidade:
  - remover / substituir / recolocar módulo
- Painel de sustentabilidade:
  - material, CO2, reusabilidade, reciclabilidade
- Passaporte digital mock com modal

---

## Como rodar em localhost

### 1) Instalar dependências

```bash
npm install
```

### 2) Subir servidor local (localhost)

```bash
npm run dev
```

Acesse:
- `http://localhost:5173`

Para expor na rede local (LAN):

```bash
npm run dev:host
```

Acesse:
- `http://localhost:5173`
- `http://SEU_IP_LOCAL:5173`

---

## Correção para erro de teste/instalação (403 Forbidden)

Se `npm install` falhar com `403 Forbidden`, o problema é de **política de rede/registry**.

### Passos recomendados

1. Configure o registry interno da empresa:

```bash
cp .npmrc.example .npmrc
```

2. Edite `.npmrc` com a URL correta do registry corporativo e autenticação (token), por exemplo:

```ini
registry=https://npm.company.internal/
always-auth=true
//npm.company.internal/:_authToken=${NPM_TOKEN}
```

3. Rode novamente:

```bash
npm install
```

---

## Testes

Teste de sanidade local (sem dependências externas):

```bash
npm run test
```

Esse teste valida a presença dos arquivos essenciais do MVP.

---

## Stack

- React
- Vite
- Three.js
- TailwindCSS
