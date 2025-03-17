# NextJS Chat Application Documentation

## Overview

This document provides an architectural overview and implementation guidance for building a NextJS frontend that integrates with your Express and WebSocket backend services. The application allows users to sign up, log in, create chat rooms, and exchange real-time messages.

## Architecture

### System Components

1. **Frontend (NextJS)**
   - User interface for authentication, room management, and chat
   - Communicates with backend via HTTP and WebSocket

2. **HTTP Backend (Express)**
   - Authentication (sign-up, sign-in)
   - Room management
   - Message history retrieval

3. **WebSocket Backend**
   - Real-time message broadcasting
   - Room joining/leaving management
   - Connection management

### Data Flow

```
                    HTTP
                    ┌─────────┐
                    │         │
User ────── NextJS ─┤ Express │
                    │         │
                    └─────────┘
                       │
                       │ Database Operations
                       ▼
                    ┌─────────┐
                    │         │
                    │ PrismaDB│
                    │         │
                    └─────────┘
                       ▲
                       │ Database Operations
                       │
                    ┌─────────┐
                    │         │
User ────── NextJS ─┤   WS    │
                    │         │
                    └─────────┘
                    WebSocket
```

## Frontend Implementation

### Pages

1. **Login Page (`/login`)**
   - User authentication form
   - JWT token storage

2. **Sign-up Page (`/signup`)**
   - New user registration form

3. **Home Page (`/`)**
   - Room listing and creation interface
   - Protected route (requires authentication)

4. **Room Page (`/room/[slug]`)**
   - Chat interface
   - WebSocket connection management
   - Message display and sending

### Core Components

1. **Authentication Form**
   - Email and password inputs
   - Error handling and validation

2. **Room Creation Form**
   - Room name input
   - Submission to backend API

3. **Chat Interface**
   - Message display area
   - Input field for new messages
   - Connection status indicator

4. **Layout Component**
   - Consistent styling across pages
   - Metadata management

## API Integration

### HTTP Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/sign-up` | POST | Create new user | `{ username, email, password }` | `{ userId }` |
| `/sign-in` | POST | Authenticate user | `{ email, password }` | `{ token }` |
| `/room` | POST | Create new room | `{ roomName }` | `{ roomId }` |
| `/room/:slug` | GET | Get room details | N/A | `{ room }` |
| `/chats/:roomId` | GET | Get room messages | N/A | `{ messages }` |

### WebSocket Protocol

1. **Connection**
   - Connect to: `ws://localhost:8080?token={jwt_token}`

2. **Message Types**
   - `join_room`: Join a chat room
   ```json
   {
     "type": "join_room",
     "roomId": "roomIdString"
   }
   ```
   
   - `leave_room`: Leave a chat room
   ```json
   {
     "type": "leave_room",
     "roomId": "roomIdString"
   }
   ```
   
   - `chat`: Send a chat message
   ```json
   {
     "type": "chat",
     "roomId": "roomIdString",
     "message": "Message text"
   }
   ```

3. **Incoming Messages**
   ```json
   {
     "type": "chat",
     "message": "Message text",
     "roomId": "roomIdString"
   }
   ```

## Authentication Implementation

### JWT Storage

```typescript
// Store token after login
localStorage.setItem('token', response.data.token);

// Retrieve token for authenticated requests
const token = localStorage.getItem('token');
```

### Authenticated Requests

```typescript
const makeAuthenticatedRequest = async (url, method, data = null) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios({
      url,
      method,
      data,
      headers: {
        'Authorization': token
      }
    });
    
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};
```

### Route Protection

```typescript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
  }
}, [router]);
```

## WebSocket Implementation

### Connection Setup

```typescript
const connectWebSocket = (token) => {
  const socket = new WebSocket(`ws://localhost:8080?token=${token}`);
  
  socket.onopen = () => {
    setConnected(true);
    // Join room after connection is established
    socket.send(JSON.stringify({
      type: 'join_room',
      roomId: roomId
    }));
  };
  
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    handleIncomingMessage(message);
  };
  
  socket.onclose = () => {
    setConnected(false);
  };
  
  return socket;
};
```

### Message Handling

```typescript
const handleIncomingMessage = (data) => {
  if (data.type === 'chat') {
    setMessages(prevMessages => [
      ...prevMessages,
      {
        message: data.message,
        userId: data.userId || 'unknown',
        roomId: data.roomId
      }
    ]);
  }
};

const sendMessage = (message) => {
  if (socketRef.current && connected) {
    socketRef.current.send(JSON.stringify({
      type: 'chat',
      roomId: roomId,
      message: message
    }));
  }
};
```

## State Management

### Key State Variables

```typescript
// User authentication
const [user, setUser] = useState(null);

// Room page
const [messages, setMessages] = useState([]);
const [roomDetails, setRoomDetails] = useState(null);
const [connected, setConnected] = useState(false);
const [newMessage, setNewMessage] = useState('');
```

### Message Display

```typescript
const MessageList = ({ messages, currentUserId }) => {
  return (
    <div className="message-container">
      {messages.map((msg, index) => (
        <div 
          key={msg.id || index} 
          className={`message ${msg.userId === currentUserId ? 'self' : 'other'}`}
        >
          <div className="message-sender">{msg.userId === currentUserId ? 'You' : `User ${msg.userId}`}</div>
          <div className="message-content">{msg.message}</div>
        </div>
      ))}
    </div>
  );
};
```

## Implementation Steps

1. **Project Setup**
   - Initialize NextJS project with TypeScript
   - Configure Tailwind CSS for styling
   - Set up project structure and routing

2. **Authentication**
   - Implement login and signup forms
   - Add API calls to authentication endpoints
   - Set up token storage and retrieval

3. **Room Management**
   - Create room listing and creation interfaces
   - Implement API calls for room operations
   - Set up navigation between rooms

4. **WebSocket Integration**
   - Implement WebSocket connection handling
   - Add message sending and receiving logic
   - Create UI for real-time messaging

5. **Styling and UI/UX**
   - Apply consistent styling across the application
   - Add loading states and error handling
   - Improve user experience with feedback and notifications

## Best Practices

1. **Error Handling**
   - Implement consistent error handling for API calls
   - Provide user-friendly error messages
   - Add retry logic for failed operations

2. **Performance**
   - Optimize message rendering for large chat histories
   - Implement pagination for message retrieval
   - Use efficient state management techniques

3. **Security**
   - Validate user input on the client side
   - Implement proper token handling and expiration
   - Use HTTPS for all API communications

4. **Accessibility**
   - Ensure all UI elements are keyboard accessible
   - Add proper ARIA attributes for screen readers
   - Maintain sufficient color contrast for readability

5. **Testing**
   - Write unit tests for critical components
   - Add integration tests for user flows
   - Test WebSocket functionality thoroughly

## Potential Enhancements

1. **User Profiles**
   - Add user avatars and display names
   - Implement user profile editing

2. **Message Features**
   - Add read receipts and typing indicators
   - Support for multimedia messages

3. **Room Management**
   - Add room permissions and moderation
   - Implement private messaging

4. **UI Improvements**
   - Add dark mode support
   - Implement responsive design for mobile users

5. **Offline Support**
   - Add message caching for offline use
   - Implement reconnection logic for dropped connections

---

This documentation provides a comprehensive guide for building a NextJS chat application that integrates with your existing backend services. By following these guidelines, you can create a feature-rich, real-time chat application with proper authentication and room management.
