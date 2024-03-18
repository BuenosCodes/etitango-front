export const styles = {
  itemButtonMenuStyle: {
    borderBottomLeftRadius: '25px',
    borderTopLeftRadius: '25px',
    borderTopRightRadius: { xs: '25px', md: '0px' },
    borderBottomRightRadius: { xs: '25px', md: '0px' },
    padding: '12px 0px 12px 12px',
    marginBottom: '10px',
    color: 'greyScale.50'
  },

  itemButtonSubMenuStyle: {
    borderRadius: '100px',
    padding: '6px 16px 6px 16px',
    marginBottom: '10px',
    color: 'greyScale.50'
  },

  itemButtonHoverStyle: {
    backgroundColor: 'background.floralWhite',
    color: 'greyScale.900',
    '& .MuiListItemIcon-root': {
      color: 'greyScale.900'
    }
  },

  itemButtonActiveStyle: {
    backgroundColor: 'background.floralWhite',
    color: 'greyScale.900',
    '& .MuiListItemIcon-root': {
      color: 'greyScale.900'
    }
  },

  fontListText: {
    fontFamily: 'roboto',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '20px',
  }
};
