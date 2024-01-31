/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { Button } from "@mui/material";
import { createContext, useEffect, useState } from "react";

const CloudinaryScriptContext = createContext();

function CloudinaryUploadWidget({ uwConfig, onImageUpload }) {

  const [loaded, setLoaded] = useState(false);
  //const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      var myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("result info: ", result.info);
            onImageUpload(result.info.url);
          }
        }
      );
  
      if (!myWidget.isShowing()) {
        myWidget.open();
      }
    }
  };
  

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '187px',
    padding: '10px 24px 10px 20px',
    borderRadius: '12px',
    backgroundColor: '#A82548',
    height: '44px',
    color: '#fff',
    border: 'none',
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <Button
        id="upload_widget"
        className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
        style={buttonStyles}
      >
        Subir nueva portada
      </Button>
    </CloudinaryScriptContext.Provider>
  );
}

export default CloudinaryUploadWidget;
export { CloudinaryScriptContext };