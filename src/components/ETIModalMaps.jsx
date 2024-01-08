/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
// ModalForm.jsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Typography, makeStyles } from '@mui/material';

const ETIModalMaps = ({ isOpen, handleCloseModal }) => {
  const [step, setStep] = useState(1);
  const [currentImage, setCurrentImage] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      // Restablecer estado al cerrar el modal
      setStep(1);
      setCurrentImage(1);
    }
  }, [isOpen]);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      setCurrentImage(currentImage + 1);
    } else {
      handleCloseModal();
    }
  };

  const getTextByStep = () => {
    switch (step) {
      case 1:
        return "Primero, busquemos nuestro lugar de interés en Google Maps.";
      case 2:
        return "Luego, desplegamos el menú en la parte superior izquierda (    )\n\nCasi al final, encontramos la opción que buscamos: 'Compartir o insertar el mapa'";
      case 3:
        return "Finalmente, en 'Insertar un mapa', copia la dirección con el botón 'Copiar HTML'.\n\nListo, ya tenés todo para seguir con tu formulario del ETI";
      default:
        return "";
    }
  };

  const getImageByStep = () => {
    switch (currentImage) {
      case 1:
        return '/img/MapsImage1.png'; 
      case 2:
        return '/img/MapsImage2.png'; 
      case 3:
        return '/img/MapsImage3.png'; 
      default:
        return "";
    }
  };

  const getButtonText = () => {
    return step < 3 ? "Siguiente" : "Finalizar";
  };

  

  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 423,
          height: 700,
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: 24,
          padding: '42px 24px 32px 24px',
          justifyContent: 'space-between',
          
        }}
      >
        <Box
          sx={{
            marginLeft: '5px',
            height: 620,
          }}
        >
          <Button
            onClick={handleCloseModal}
            sx={{ position: 'absolute', top: 10, right: 0,}}
          >
            <img src='/img/icon/trailing-icon.png'/>
          </Button>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px', alignItems: 'center',  borderBottom: '1px solid #E0E0E0', marginBottom: '16px',}}>
            {[1, 2, 3].map((circle) => (
              <div
                key={circle}
                style={{
                  width: step === circle ? '24px' : '16px',
                  height: step === circle ? '24px' : '16px',
                  borderRadius: '50%',
                  backgroundColor: step === circle ? '#E68650' : '#BDBDBD',
                  marginRight: '8px',
                  marginBottom: '16px',
                }}
              />
            ))}
          </div>
          <Box sx={{ height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={getImageByStep()} alt={`Step ${currentImage}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
          </Box>
          <Box sx={{ height: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid #E0E0E0' }}>
            <Typography variant="body1" 
            sx={{
              fontFamily: 'Roboto', display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              color: '#0075D9',
              fontSize: '16px',
              fontWeight: 500
            }}
            >
              {getTextByStep()}
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              width: '350px',
              height: '54px',
              padding: '18px 16px', 
              borderRadius: '100px',
              mt: 2,
              backgroundColor: '#A82548',
              color: 'white',
              
            }}
            onClick={handleNextStep}
          >
            {getButtonText()}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ETIModalMaps;