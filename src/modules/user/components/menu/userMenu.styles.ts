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
  }
};
