import React, {useState} from "react";
import {Container, TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const ForumHome = (props) => {
  const {
    address,
    profile,
    did
  } = props;

  const [joining, setJoining] = useState('open');
  const [publishing, setPublishing] = useState('open');
  const [location, setLocation] = useState(null);
  const [presicion, setPresicion] = useState(null);
  return (<Container>
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper>
          <Typography component="h3">Add new thread</Typography>

          <form noValidate autoComplete='off'>
            <Grid container item >
              <TextField id='title' label='Thread Tile' />
            </Grid>
            <Grid container item>
              <TextField id='description' label="Description" />
            </Grid>
            <Grid container item>
            <FormControl>
              <InputLabel id="location-label">Location</InputLabel>
              <Select labelId="location-label" id='location'
                      value={location}
                      onChange={ (e) => setLocation(e.target.value)}>
                <MenuItem value="open"></MenuItem>

              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="presicion-label">Visibility</InputLabel>
              <Select labelId="presicion-label" id='location'
                      value={presicion}
                      onChange={ (e) => setPresicion(e.target.value)}>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={11}>11</MenuItem>
                <MenuItem value={12}>12</MenuItem>
              </Select>
            </FormControl>
            </Grid>
            <Grid container item>
            <FormControl>
              <InputLabel id="joining-label">Joining</InputLabel>

              <Select labelId="joining-label" id='privacy'
                      value={joining}
                      onChange={ (e) => setJoining(e.target.value)}>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="activity">Activity</MenuItem>
                <MenuItem value="holding">Holders</MenuItem>
                <MenuItem value="reputation">Reputation</MenuItem>
                <MenuItem value="Mixed">Mixed</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="privacy-label">Publishing</InputLabel>

              <Select labelId="privacy-label" id='privacy'
                      value={publishing}
                      onChange={ (e) => setPublishing(e.target.value)}>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="activity">Activity</MenuItem>
                <MenuItem value="holding">Holders</MenuItem>
                <MenuItem value="reputation">Reputation</MenuItem>
                <MenuItem value="Mixed">Mixed</MenuItem>
              </Select>
            </FormControl>
            </Grid>
            <Button  variant="contained" color="primary">
              Create
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  </Container>)
}


export default ForumHome;