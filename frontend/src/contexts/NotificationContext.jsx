import { createContext, useContext, useReducer } from "react";

const NotificationContext = createContext();

const initialState = {
  notifications: [],
  unreadCount: 0,
};

const notificationReducer = (state, action) => {
  switch (action.type) {

    case "SET_NOTIFICATIONS": {
      const unread = action.payload.filter(n => !n.read).length;
      return {
        notifications: action.payload,
        unreadCount: unread,
      };
    }

    case "ADD_NOTIFICATION": {
      return {
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }

    case "MARK_ALL_READ": {
      return {
        notifications: state.notifications.map(n => ({
          ...n,
          read: true,
        })),
        unreadCount: 0,
      };
    }

    default:
      return state;
  }
};

export const NotificationProvider = ({children}) => {
    const [state, dispatch] = useReducer(notificationReducer,initialState);

    return (
        <NotificationContext.Provider value={{...state, dispatch}}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => useContext(NotificationContext);