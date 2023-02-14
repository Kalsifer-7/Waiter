import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    card: {
        marginTop: theme.spacing(2)
    },
    info: {
        alignContent: "flex-start",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        width: "45%",
        display: "flex",
        margin: "auto",
        padding: theme.spacing(1),
        [theme.breakpoints.down('xs')]: {
            width: "75%",
        }
    },
    infoContent: {
        width: "100%",
        display: "flex",
    },
    turn: {
        width: "100%",
        display: "flex",
        [theme.breakpoints.down('xs')]: {
            display: "block",
        }
    },
    total: {
        color: theme.palette.grey[500],
    },
    price: {
        marginLeft: "auto",
        fontWeight: "bold"
    },
    confirm: {
    },
    button: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        padding: "3%",
        width: "100%",
        background: theme.palette.secondary.main,
        '&:hover': {
            background: theme.palette.secondary.dark,
        },
        [theme.breakpoints.down('xs')]:{
            padding: "5%",
        }
    },
    quantity: {
        margin: "15px",
        [theme.breakpoints.down('xs')]: {
            marginLeft: "1px",
            marginRight: "1px",
        }
    },
        list: {
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
}));