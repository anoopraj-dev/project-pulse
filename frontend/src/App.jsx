import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import ModalProvider from "./contexts/ModalContext";
import { Toaster } from "react-hot-toast";
import { FileUploadProvider } from "./contexts/FileUploadContext";
import { ImageModalProvider } from "./contexts/ImageModalContext";

const App = () => {
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
            background: "#0096C7",
            color: "#fff",
            borderRadius: "8px",
            padding: "16px",
            fontWeight: "500",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#fff",
              secondary: "#0096C7",
            },
          },
          error: {
            style: {
              background: "#f44336",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#f44336",
            },
          },
        }}
      />
    </Router>
  );
};

export default App;
