import React, { PureComponent } from 'react'
import axios from 'axios';

import AppAppBar from '../../components/AppAppBar';
import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

class InscripcionList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      inscripciones: []
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:8000/event/inscription/')
      .then(response => {
        this.setState({ inscripciones: response.data.inscriptions })
      })
      .catch(e => {
        console.error(e);
      })
  }

  render() {
    const { inscripciones } = this.state;

    return (
      <React.Fragment>
        <AppAppBar />
        <Container maxWidth="lg" sx={{ marginTop: 6 }}>
          <Grid container direction="column" spacing={3}>
            <Grid item><Typography variant="h2" color="secondary" align="center">Formulario de inscripción</Typography></Grid>
            <Grid item>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Nombre</TableCell>
                      {/* <TableCell align="right">Provincia</TableCell>
                      <TableCell align="right">Ciudad</TableCell>
                      <TableCell align="right">Provincia</TableCell> */}
                      <TableCell align="right">Estado de la inscripción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inscripciones.map((inscripcion) => (
                      <TableRow
                        key={inscripcion.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {`${inscripcion.name} ${inscripcion.last_name}`}
                        </TableCell>
                        {/* <TableCell align="right">{inscripcion.country}</TableCell>
                        <TableCell align="right">{inscripcion.province}</TableCell>
                        <TableCell align="right">{inscripcion.city}</TableCell> */}
                        <TableCell align="right">{inscripcion.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    )
  }
}


export default InscripcionList;