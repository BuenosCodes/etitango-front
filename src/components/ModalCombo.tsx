<Modal open={open} onClose={() => handleClose()}>
<Box sx={{ ...styleModal, display: 'flex', flexDirection: 'column' }}>
  <Grid container alignItems="center" justifyContent="space-between">
    <Grid>
      {/* Title */}
      <Typography variant="h4">Añadí más productos al combo</Typography>
    </Grid>
    <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      {/* Icon add */}
      <Button>
        {/* Validate*/}
        <img
          src={'/img/icon/btnDelete.svg'}
          alt="btnDelete"
          height={50}
          width={50}
        />
      </Button>
      {/* Icon remove */}
      <Button>
        {/* Validate*/}
        <img src={'/img/icon/btnPlus.svg'} alt="btnPlus" height={50} width={50} />
      </Button>
    </Grid>
  </Grid>
  {/** Fields  */}
  <Grid item xs={12}>
    <Field
      name="product1"
      placeholder="Producto 1"
      component={TextField}
      required
      fullWidth
      sx={{ marginTop: 3 }} // Adjust the marginTop value as necessary
      classes={{ root: classes.root }}
    />
    <Grid item xs={12}>
      <Field
        name="product2"
        placeholder="Producto 2"
        component={TextField}
        required
        fullWidth
        sx={{ marginTop: 3 }} // Adjust the marginTop value as necessary
        classes={{ root: classes.root }}
      />
    </Grid>
    <Grid item xs={12}>
      <Field
        name="product3"
        placeholder="Producto 3"
        component={TextField}
        required
        fullWidth
        sx={{ marginTop: 3 }} // Adjust the marginTop value as necessary
        classes={{ root: classes.root }}
      />
    </Grid>
    <Grid container justifyContent="flex-end">
      <Grid item>
        {/** Button to add  */}
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          disabled={enable}
          sx={{
            width: '150px',
            padding: '12px, 32px, 12px, 32px',
            borderRadius: '25px',
            marginTop: '80px',
            backgroundColor: enable ? '#CCCCCC' : '#A82548',
            height: '44px',
            '&:hover': {
              backgroundColor: enable ? '#CCCCCC' : '#A82548'
            }
          }}
        >
          <Typography
            sx={{
              color: '#FAFAFA',
              fontWeight: 500,
              fontSize: '15px',
              lineHeight: '10px'
            }}
          >
            Agregar
          </Typography>
        </Button>
      </Grid>
    </Grid>
  </Grid>
</Box>
</Modal>
</Grid>