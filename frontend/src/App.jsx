import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import ModalProvider from "./contexts/ModalContext";
import { Toaster } from "react-hot-toast";
import { FileUploadProvider } from "./contexts/FileUploadContext";
import { ImageModalProvider } from "./contexts/ImageModalContext";
import { useEffect } from "react";
import { socket } from "./socket";
import { useUser } from "./contexts/UserContext";
import { useNotifications } from "./contexts/NotificationContext";
import { getNotifications } from "./api/user/userApis";

const App = () => {
  const { id,role } = useUser();
  const {dispatch} = useNotifications();

  const fetchNotifications = async () => {
    const res = await getNotifications(role);
    dispatch({
      type: 'SET_NOTIFICATIONS',
      payload: res.data.notifications
    })
  }

  //------------- Socket implementation -------------

  useEffect(() => {
    if (!id || !role) return;
    socket.disconnect();

    socket.auth = {
      userId: id,
      role:role,
    };

    if (!socket.connected) {
      socket.connect();
    }
    fetchNotifications();

    socket.on("notification:new", (notification) => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload:notification
      })
    });


    return () => {
      socket.off("notification:new");
      
    };
  }, [id, role]);

  return (
    <Router>

      <FileUploadProvider>
        <ImageModalProvider>
          <ModalProvider>
            <AppRoutes />
          </ModalProvider>
        </ImageModalProvider>
      </FileUploadProvider>

      <Toaster
        position="top-right"
        containerStyle={{
          top: "10%",
        }}
        toastOptions={{
          style: {
            background: "#0096C7", // primary color
            color: "#fff", // text color
            borderRadius: "8px",
            padding: "16px",
            fontWeight: "500",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#fff", // icon background
              secondary: "#0096C7", // icon color
            },
          },
          error: {
            style: {
              background: "#f44336",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#f44336", // error
            },
          },
        }}
      />
    </Router>
  );
};

export default App;
