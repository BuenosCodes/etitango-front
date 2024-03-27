export const styles = {
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: { xs: '', md: 3, lg: 3 },
    width: { xs: 380, sm: '100%', md: '100%', lg: 960 },
    height: 820,
    borderRadius: '12px',
    minWidth: { xs: '95%', sm: 0 },
    overflow: 'auto',
    backgroundColor: 'background.white',
    marginX: { xs: 'auto', sm: 'auto', md: '20px', lg: 'auto' },
    marginY: '20px'
  },
  newEtiContainer: {
    margin: { xs: 0, sm: '20px' },
    backgroundColor: { xs: 'background.white', sm: 'greyScale.50' },
    borderRadius: '12px',
    p: 2
  },
  titleContainer: {
    color: { xs: 'details.azure', md: 'background.white' },
    backgroundColor: { xs: '', md: 'details.azure' },
    padding: { xs: '8px 24px 16px 8px', sm: '12px 24px 12px 24px' },
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '16px',
    fontFamily: 'Montserrat',
    height: '40px'
  },
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'greyScale.50',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: 3,
    p: 2,
    overflow: 'auto',
    width: { xs: '80%', md: '900px' },
    height: '500px',
    display: 'flex',
    flexDirection: 'column'
  },
  chipStyles: {
    m: 1,
    borderRadius: '8px',
    color: 'principal.secondary',
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: '14px'
  },
  organizersContainer: {
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scrollbarStyles: {
    overflowY: { xs: 'none', sm: 'auto' },
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'details.uranianBlue',
      borderRadius: '12px'
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
      boxShadow: '1px 0px 2px 0px #6695B7',
      borderRadius: '12px'
    },
    '.css-10gzpdc-MuiFormHelperText-root': {
      fontSize: { xs: '10px', md: '12px' },
      ml: 0,
      mr: 0
    }
  }
};
