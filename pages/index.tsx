import { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  Autocomplete,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

type Movie = {
  id: number;
  title: string;
  gender: string;
};

const AvaliableGenders = [
  { value: 1, label: "Acción" },
  { value: 2, label: "Animación" },
  { value: 3, label: "Aventura" },
  { value: 4, label: "Ciencia Ficción" },
  { value: 5, label: "Comedia" },
  { value: 6, label: "Documental" },
  { value: 7, label: "Fantasía" },
  { value: 8, label: "Horror" },
  { value: 9, label: "Romance" },
  { value: 10, label: "Suspenso" },
];

const IndexPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieGender, setNewMovieGender] = useState("");
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const movieList = localStorage.getItem("movieList");
    console.log(movieList);
    if (movieList) {
      setMovies(JSON.parse(movieList));
    }
  }, []);

  /*useEffect(() => {
    localStorage.setItem("movieList", JSON.stringify(movies));
  }, [movies]);*/

  const handleAddMovie = () => {
    if (newMovieTitle.trim() !== "" && newMovieGender.trim() !== "") {
      const newMovie: Movie = {
        id: movies.length + 1,
        title: newMovieTitle,
        gender: newMovieGender,
      };
      localStorage.setItem("movieList", JSON.stringify([...movies, newMovie]));
      setMovies([...movies, newMovie]);
      setNewMovieTitle("");
      setNewMovieGender("");
    }
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
  };

  const handleSaveMovie = () => {
    if (editingMovie) {
      const updatedMovies = movies.map((movie) =>
        movie.id === editingMovie.id ? { ...editingMovie } : movie
      );
      setMovies(updatedMovies);
      setEditingMovie(null);
      localStorage.setItem("movieList", JSON.stringify(updatedMovies));
    }
  };

  const handleDeleteMovie = (movie: Movie) => {
    const updatedMovies = movies.filter((m) => m.id !== movie.id);
    setMovies(updatedMovies);
    localStorage.setItem("movieList", JSON.stringify(updatedMovies));
  };

  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        margin: "100px",
        padding: "100px",
        background: "white",
        borderRadius: "16px",
      }}
    >
      <Typography variant="h2" textAlign={"center"}>
        Lista de películas
      </Typography>
      <Typography variant="body1" textAlign={"center"} margin={"20px"}>
        Aquí puedes anotar la lista de peliculas que quieres ver
      </Typography>
      <Stack direction={"row"} component={"form"}>
        <TextField
          label="Titulo de la pelicula"
          value={newMovieTitle}
          onChange={(e) => setNewMovieTitle(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={AvaliableGenders}
          inputValue={newMovieGender}
          onInputChange={(event, newInputValue) => {
            console.log(newInputValue);
            setNewMovieGender(newInputValue);
          }}
          sx={{ width: 300, marginLeft: "20px" }}
          renderInput={(params) => <TextField {...params} label="Género" />}
        />
        <Button
          sx={{ width: 300, marginLeft: "20px" }}
          variant="contained"
          onClick={handleAddMovie}
        >
          Guardar
        </Button>
      </Stack>

      <Table
        sx={{ minWidth: 650, marginTop: "40px" }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h5">Titulo</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h5">Género</Typography>
            </TableCell>
            <TableCell align="right" width={"20px"}>
              <Typography variant="h5"></Typography>
            </TableCell>
            <TableCell align="right" width={"20px"}>
              <Typography variant="h5"></Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Typography fontSize={"18px"}>{row.title}</Typography>
              </TableCell>
              <TableCell>
                <Typography fontSize={"18px"}>{row.gender}</Typography>
              </TableCell>
              <TableCell align="right" width={"20px"}>
                <IconButton onClick={() => handleEditMovie(row)}>
                  <Edit />
                </IconButton>
              </TableCell>
              <TableCell align="right" width={"20px"}>
                <IconButton onClick={() => handleDeleteMovie(row)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={Boolean(editingMovie)}
        onClose={() => setEditingMovie(null)}
      >
        <DialogTitle>Editar película</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edita el título de la película seleccionada.
          </DialogContentText>
          <TextField
            label="Título"
            value={editingMovie?.title}
            onChange={(e) => {
              if (editingMovie) {
                const newMovie: Movie = {
                  id: editingMovie.id,
                  title: e.target.value,
                  gender: editingMovie.gender,
                };
                setEditingMovie(newMovie);
              }
            }}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Autocomplete
            disablePortal
            id="combo-box-edit"
            options={AvaliableGenders}
            inputValue={editingMovie?.gender}
            value={{ value: 0, label: editingMovie?.gender }}
            onInputChange={(event, newInputValue) => {
              if (editingMovie) {
                const newMovie: Movie = {
                  id: editingMovie.id,
                  title: editingMovie.title,
                  gender: newInputValue,
                };
                setEditingMovie(newMovie);
              }
            }}
            sx={{ width: 300, marginTop: "20px" }}
            renderInput={(params) => <TextField {...params} label="Género" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingMovie(null)}>Cancelar</Button>
          <Button onClick={handleSaveMovie}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IndexPage;
