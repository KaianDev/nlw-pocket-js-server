<h1 align="center" style="font-weight: bold;">NLW Pocket-Javascript (SERVER) 💻</h1>

<p align="center">
    Versão da aplicação backend em NodeJS in.orbit do evento da NLW Pocket-Javascript da Rocketseat.
</p>

<h2 id="technologies">💻 Tecnologias</h2>

- NodeJS
- Fastify
- DrizzleORM
- BiomeJS

<h2 id="started">🚀 Iniciando</h2>

Tenha instalado em sua máquina as seguintes tecnologias:

- [NODEJS](https://nodejs.org)
- [DOCKER](https://www.docker.com)

<h3>Clonando projeto</h3>

```bash
git clone https://github.com/KaianDev/nlw-pocket-js-server.git
```

<h3>Instalando as dependências</h3>

- Inicia sua aplicação com os comandos abaixo:
```bash
cd nlw-pocket-js-server/
npm install
```

<h3>Iniciando o container do banco de dados e populando o banco de dados</h3>

Inicie seu docker e execute o comando abaixo para que o container com o banco de dados comece a executar

- Suba seu container do banco de dados:
```bash
docker-compose up -d  
```

- Populando o banco de dados
```bash
npx drizzle-kit migrate
npm run seed
```

<h3>Iniciando a aplicação em desenvolvimento</h3>

- Executando a aplicação:
```bash
npm run dev
```
***A aplicação estará executando em http://localhost:3333***

<h2 id="routes">📍 Endpoints da API</h2>

​
| route               | description                                          
|----------------------|-----------------------------------------------------
| <kbd>POST /goals</kbd>     | cria uma meta [detalhes da resposta](#post-goals-detail)
| <kbd>GET /pending-goals</kbd>     | lista todas as metas pendentes até o último dia da semana atual [detalhes da resposta](#get-pending-goals-detail)
| <kbd>POST /completion</kbd>     | marca uma meta com concluída [detalhes da resposta](#post-completion-detail)
| <kbd>POST /completion</kbd>     | marca uma meta com concluída [detalhes da resposta](#post-completion-detail)
| <kbd>GET /summary</kbd>     | lista as metas concluídas divididas por dias e um resumo com total de metas concluídas e a concluir  [detalhes da resposta](#get-summary-detail)


<h3 id="post-goals-detail">POST /goals</h3>

**REQUEST BODY**
```json
{
  "title": "Meditar",
  "desiredWeeklyFrequency": 7,
}
```

<h3 id="get-pending-goals-detail">GET /pending-goals</h3>

**RESPONSE**
```json
{
  "pendingGoals": [
    {
      "id": "cm0zcu8w1000108jyc2u8hm5y",
      "title": "Dormir cedo",
      "desiredWeeklyFrequency": 5,
      "completionCount": 1
    },
    {
      "id": "cm0zcwj7h000208jy467n9k4k",
      "title": "Estudar",
      "desiredWeeklyFrequency": 5,
      "completionCount": 0
    },
  ]
}
```


<h3 id="post-completion-detail">POST /completion</h3>

**REQUEST BODY**
```json
{
  "goalId": "cm0zcwj7h000208jy467n9k4k",
}
```

<h3 id="get-summary-detail">GET /summary</h3>

**RESPONSE**
```json
{
    "summary": {
        "totalCompletions": 2,
        "totalDesiredFrequency": 10,
        "completionsByDate": {
            "2024-09-09": [
                {
                    "id": "cm0zcwj7h000208jy467n9k4k",
                    "title": "Estudar",
                    "createdAt": "2024-09-09T03:00:00+00:00",
                },
                {
                    "id": "cm0zcwj7h000208jy467n9k4k",
                    "title": "Estudar",
                    "createdAt": "2024-09-09T12:00:00+00:00",
                },
            ]
            
        }

    }
}
```

