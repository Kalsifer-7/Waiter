import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  background: {

  },
  root: {
    margin: "auto",
    marginTop: theme.spacing(20),
    padding: theme.spacing(2),
    textAlign: "center",
    maxWidth: theme.breakpoints.values.sm,
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2),
      padding: theme.spacing(1),
      marginTop: theme.spacing(15),
    }
  },
  title:{

  },
  avatar: {
    margin: "auto",
    marginTop: theme.spacing(1),
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: "60%",
    textAlign: "center",
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(0),
    }
  },
  subtitle: {
    color: theme.palette.secondary.contrastText,
    marginTop: theme.spacing(2),
  },
  dismiss: {
    color: theme.palette.secondary.contrastText,
  }
}));