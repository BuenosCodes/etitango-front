export const styles = {
  container: {
    border: '3px solid black',
    borderTop: 'none',
    display: 'flex'
  },
  item: {
    flex: 1,
    borderRight: '2px solid black',
    '&:nth-last-of-type(1)': {
      borderRight: 'none'
    },
    margin: 0,
    borderRadius: 0,
    fontSize: 14
  },
  selectedItem: {
    color: '#C747CA'
  },

  itemButtonMenuStyle: {
    borderBottomLeftRadius: '25px',
    borderTopLeftRadius: '25px',
    borderTopRightRadius: { xs: '25px', md: '0px' },
    borderBottomRightRadius: { xs: '25px', md: '0px' },
    padding: '12px 0px 12px 12px',
    marginBottom: '10px',
    color: 'listItems.light'
  },

  itemButtonSubMenuStyle: {
    borderRadius: '100px',
    padding: '6px 16px 6px 16px',
    marginBottom: '10px',
    color: 'listItems.light'
  },

  itemButtonHoverStyle: {
    backgroundColor: 'listItems.main',
    color: 'listItems.dark',
    '& .MuiListItemIcon-root': {
      color: 'listItems.dark'
    }
  },

  itemButtonActiveStyle: {
    backgroundColor: 'listItems.main',
    color: 'listItems.dark',
    '& .MuiListItemIcon-root': {
      color: 'listItems.dark'
    }
  },

  fontListText: {
    fontFamily: 'roboto',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '20px'
  },
};


