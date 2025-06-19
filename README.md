# go-msg-wss-app

Aplicativo mobile de chat anônimo em tempo real, desenvolvido em React Native + Expo, com backend em Go (WebSocket + REST).

## Funcionalidades

- **Login anônimo:** Entre apenas com um nickname (JWT mockado).
- **Salas de chat:** Crie e navegue entre salas anônimas.
- **Mensagens em tempo real:** Envie, curta, descurta e marque mensagens como respondidas.
- **WebSocket:** Atualização instantânea das mensagens e reações.
- **Estado global:** Contextos para usuário, salas e chat.
- **Navegação:** React Navigation para fluxo entre telas.

## Estrutura do Projeto

```
src/
├── api/           # Funções REST para rooms e messages
├── components/    # Componentes reutilizáveis (RoomCard, MessageBubble)
├── config/        # Configurações de ambiente (URLs da API e WebSocket)
├── context/       # Contextos globais (Auth, Room, Chat)
├── hooks/         # Hooks customizados (useWebSocket)
├── navigation/    # Navegação principal
├── screens/       # Telas (Login, RoomList, Chat)
.env               # Variáveis de ambiente (URLs da API e WebSocket)
```

## Fluxo do Usuário

1. **Login:** Informe um nickname para entrar.
2. **Salas:** Veja a lista de salas ou crie uma nova.
3. **Chat:** Entre em uma sala, visualize e envie mensagens.
4. **Interação:** Curta/descurta mensagens, marque como respondidas.
5. **Tempo real:** Receba atualizações instantâneas via WebSocket.

## Integração com a API

- **REST:**
  - Listar salas: `GET /api/rooms`
  - Criar sala: `POST /api/rooms` `{ theme }`
  - Listar mensagens: `GET /api/rooms/{room_id}/messages`
  - Enviar mensagem: `POST /api/rooms/{room_id}/messages` `{ message }`
  - Curtir mensagem: `PATCH /api/rooms/{room_id}/messages/{message_id}/react`
  - Descurtir mensagem: `DELETE /api/rooms/{room_id}/messages/{message_id}/react`
  - Marcar como respondida: `PATCH /api/rooms/{room_id}/messages/{message_id}/answer`
- **WebSocket:**
  - Conecte em: `ws://<host>:8080/subscribe/{room_id}`
  - Eventos: `message_created`, `message_reaction_increased`, `message_reaction_decreased`, `message_answered`

## Tecnologias
- React Native + Expo
- TypeScript
- Axios
- React Navigation
- WebSocket
- Context API

## Como rodar

1. Configure as variáveis de ambiente:
   - Copie o arquivo `.env` e ajuste os IPs conforme necessário
   - Para desenvolvimento local, use `localhost`
   - Para testes em dispositivo físico, use o IP da máquina (ex: `192.168.10.84`)

2. Instale as dependências:
   ```sh
   npm install
   # ou
   yarn
   ```
3. Inicie o app:
   ```sh
   npm start
   # ou
   yarn start
   ```
4. Certifique-se que o backend Go está rodando na URL configurada no `.env`.

## Observações
- O app funciona como guest (sem autenticação obrigatória).
- O JWT é mockado apenas para simulação.
- O backend deve estar rodando localmente para testes.

---

Desenvolvido por Felipe Macedo.
