import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    container: {
        minHeight: "82vh",
        maxHeight: "82vh",
    },
    root: {
        width: "100%",
    },
    detailsCell: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    detailsImage: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    }
}));