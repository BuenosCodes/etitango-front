export const styles = {
  container: {
    border: '3px solid black',
    borderTop: 'none',
    flexDirection: 'column',
    display: 'flex'
  },
  item: {
    borderBottom: '2px solid black',
    '&:nth-last-of-type(1)': {
      borderBottom: 'none'
    },
    margin: 0,
    borderRadius: 0,
    fontSize: 14
  },
  selectedItem: {
    color: '#C747CA'
  }
};
