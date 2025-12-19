import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/layout/components/Navbar";
import AppRoutes from "./routes";
import ModalProvider from "./contexts/ModalContext";
import { Toaster } from "react-hot-toast";
import { FileUploadProvider } from "./contexts/FileUploadContext";

const App = () => {
  return (
    <Router>
      <FileUploadProvider>
      <ModalProvider>
        <Navbar />
        <AppRoutes />
      </ModalProvider>
      </FileUploadProvider>
      <Toaster
        position="top-right"
        containerStyle={{
          top:'10%'
        }}
        toastOptions={{
          style: {
            background: "#0096C7",  // primary color
            color: "#fff",          // text color
            borderRadius: "8px",
            padding: "16px",
            fontWeight: "500",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#fff",      // icon background
              secondary: "#0096C7"  // icon color
            }
          },
          error: {
            style:{
              background: '#f44336'
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#f44336"  // red for error
            }
          }
        }}
      />
    </Router>
  );
};

export default App;
