import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    root: {
        position: "relative",
        padding: theme.spacing(1),
        height: "20%",
        width: "100%",
        display: "flex",
    },
    media: {
        height: "100px",
        width: "200px",
    },
    content: {
        width: "100%",
    },
    name: {
    },
    price: {
        marginLeft: "auto",
        fontWeight: "bold"
    },
    actions: {
        display: "flex",
        position: "relative",
    },
    quantity: {
        display: "flex",
    }
}));