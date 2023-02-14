import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    root: {
        position: "relative",
        padding: theme.spacing(1),
        width: "100%",
        display: "flex",
    },
    media: {
        height: "100px",
        width: "350px",
        [theme.breakpoints.down('xs')]:{
            width: 0,
            height: 0,
        }
    },
    content: {
        width: "100%",
        //display: "flex",
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
    button: {
        color: theme.palette.primary.main,
    },
    quantity: {
        
    },
    delete: {
        
    }
}));